import fs from "fs";
import csvParse from "csv-parse";
import semaphoreFactory from "semaphore";
import { notFound } from "@hapi/boom";
import { getConnection } from "typeorm";
import { GeoPoint } from "../geo-point/geo-point";

// it's a timetable cache
// it stores lazy parsed timetable files
const timetable = new Map(
  fs.readdirSync("assets/timetable").map(filename => {
    const file = filename.split(".", 2)[0];

    return [
      file,
      [null, semaphoreFactory()] as [
        {}[] | null,
        ReturnType<typeof semaphoreFactory>
      ]
    ];
  })
);

export const listTimetableFiles = timetable.keys.bind(timetable);

export function readTimetableFile(filename: string): Promise<{}[]> {
  return new Promise((resolve, reject) => {
    const file = timetable.get(filename);

    if (!file) {
      reject(notFound());
      return;
    }

    const [cachedResponse, semaphore] = file;

    // fast path without semaphore
    // it's save when response is already cached
    if (cachedResponse) {
      resolve(cachedResponse);
      return;
    }

    // if not start parsing
    // but ensure that only one request triggers parsing
    // and the rest will just wait for the result
    semaphore.take(() => {
      // try again fetching the response from cache
      // because if it's a waiting request the response will already
      // be there

      // it's save because this filename was validated earlier
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const freshCache = timetable.get(filename)!;
      if (freshCache[0]) {
        resolve(freshCache[0]);
        semaphore.leave();
        return;
      }

      // if there is no cache read the timetable from csv
      const parser = fs
        .createReadStream(`assets/timetable/${filename}.txt`)
        .pipe(csvParse({ columns: true }));

      const newResponse: {}[] = [];

      (async () => {
        // eslint-disable-next-line no-restricted-syntax
        for await (const route of parser) {
          newResponse.push(route);
        }
      })()
        .then(() => {
          freshCache[0] = newResponse;
          resolve(newResponse);
        })
        .catch(reject)
        .finally(() => semaphore.leave());
    });
  });
}

type RouteWithTripsAndDistance = {
  routeId: string;
  distance: number;
  trips: { tripHeadsign: string; distance: number }[];
  routeGtfsType: number | null;
};

export async function findRoutesAndTripesNearby(
  point: GeoPoint
): Promise<RouteWithTripsAndDistance[]> {
  const routesAndTrips = await queryRoutesAndTrips(point);
  const routesMap = new Map<string, RouteWithTripsAndDistance>();

  routesAndTrips.forEach(trip => {
    const thisTrip = {
      tripHeadsign: trip.tripHeadsign,
      distance: trip.distance
    };

    const route = routesMap.get(trip.routeId);

    if (route) {
      route.trips.push(thisTrip);
      route.distance = Math.min(route.distance, trip.distance);
      return;
    }

    const newRoute: RouteWithTripsAndDistance = {
      routeId: trip.routeId,
      distance: trip.distance,
      trips: [thisTrip],
      // will be filled later
      routeGtfsType: null
    };

    routesMap.set(trip.routeId, newRoute);
  });

  (await queryRouteType(Array.from(routesMap.keys()))).forEach(
    ({ routeId, type }) => {
      // it's save because it contains only lines present in this map
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const route = routesMap.get(routeId)!;
      route.routeGtfsType = type;
    }
  );

  return Array.from(routesMap.values());
}

function queryRoutesAndTrips(
  point: GeoPoint
): Promise<
  {
    routeId: string;
    distance: number;
    tripHeadsign: string;
  }[]
> {
  return getConnection().query(
    `
    WITH candidates AS (
      SELECT *
      FROM line_lookup
      ORDER BY line <-> ST_SetSRID(st_MakePoint($1, $2), 4326)
      LIMIT 200
    )
    SELECT route_id "routeId",
           trip_headsign "tripHeadsign",
           min(distance) distance
    FROM (
          SELECT route_id,
                 trip_headsign,
                 ST_Distance(
                    ST_Transform(line, 26986),
                    ST_Transform(ST_SetSRID(st_MakePoint($1, $2), 4326), 26986)
                 ) distance
          FROM candidates
        ) _
    WHERE distance <= 50
    GROUP BY (route_id, trip_headsign)
  `,
    [point.longitude, point.latitude]
  );
}

function queryRouteType(
  routeIds: string[]
): Promise<{ routeId: string; type: number }[]> {
  return getConnection().query(
    `
    SELECT route_id "routeId",
           route_type "type"
    FROM timetable_route
    WHERE route_id = ANY($1)
  `,
    [routeIds]
  );
}

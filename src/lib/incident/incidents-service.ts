import { Repository, getRepository, getConnection } from "typeorm";
import { notFound } from "@hapi/boom";
import { Incident } from "./incident";
import { transform } from "../../helpers/transform";
import {
  queryHeadsignsOnThisTrack,
  queryRouteType
} from "../timetable/timetable-service";
import { IncidentRating } from "./incident-rating";
import { IncidentAffectedHeadsign } from "./incident-affected-headsign";
import { groupBy } from "../../helpers/group-by";
import { TimetableRouteType } from "../timetable/route-type";

function repo(): Repository<Incident> {
  return getRepository(Incident);
}

function affectedHeadsignsRepo(): Repository<IncidentAffectedHeadsign> {
  return getRepository(IncidentAffectedHeadsign);
}

function ratingsRepo(): Repository<IncidentRating> {
  return getRepository(IncidentRating);
}

export function listIncidents(): Promise<Incident[]> {
  return repo().find();
}

export function listActiveIncidents(): Promise<Incident[]> {
  return repo()
    .createQueryBuilder("incident")
    .where("now() - incident.created_at <= '1 hour'::interval")
    .getMany();
}

export async function getIncident(id: bigint): Promise<Incident> {
  const incident = await repo().findOne(id.toString());
  if (!incident) throw notFound("incident_not_found");
  return incident;
}

export async function getIncidentRouteType(
  incidentId: bigint
): Promise<TimetableRouteType | null> {
  const res = await getConnection().query(
    `
    SELECT r.route_type "type"
    FROM timetable_route r
    JOIN incidents i ON r.route_id = i.route_id
    WHERE i.id = $1
  `,
    [incidentId.toString()]
  );

  return res[0] ? res[0].type : null;
}

export async function listIncidentAffectedHeadsignsWithGtfsType(
  incidentId: BigInt
): Promise<
  { routeId: string; type: TimetableRouteType; headsigns: string[] }[]
> {
  const headsigns = await affectedHeadsignsRepo()
    .createQueryBuilder()
    .where("incident_id = :incidentId", { incidentId: incidentId.toString() })
    .getMany();

  const routesMap = groupBy(headsigns, headsign => headsign.routeId);

  return (await queryRouteType(Array.from(routesMap.keys()))).map(
    ({ routeId, type }) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const affectedHeadsigns = routesMap.get(routeId)!;

      return {
        routeId,
        type,
        headsigns: affectedHeadsigns.map(({ tripHeadsign }) => tripHeadsign)
      };
    }
  );
}

export async function createIncident(
  creatorId: bigint,
  params: Partial<Incident>
): Promise<Incident> {
  const incident = transform(Incident, params);

  incident.creatorId = creatorId;

  incident.affectedHeadsigns = (await queryHeadsignsOnThisTrack(
    incident.location,
    incident.routeId,
    incident.tripHeadsign
    // the result lacks incidentId but it is what we need for cascade insert
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  )) as any;

  if (incident.affectedHeadsigns.length === 0) {
    throw notFound("route_headsign_not_found");
  }

  await repo().save(incident);

  // hide creatorId from the response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  incident.creatorId = undefined as any;

  return incident;
}

export async function rateIncident(
  incidentId: bigint,
  customerId: bigint,
  rating: -1 | 1
): Promise<void> {
  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(IncidentRating)
    .values({
      // those need to be casted because TypeORM crashes on bigint
      incidentId: (incidentId.toString() as unknown) as bigint,
      customerId: (customerId.toString() as unknown) as bigint,
      rating
    })
    .onConflict(
      "(incident_id, customer_id) DO UPDATE SET rating = EXCLUDED.rating"
    )
    .execute()
    .catch(err => {
      if (
        err.constraint?.startsWith("FK_") &&
        err.detail?.startsWith("Key (incident_id)=(")
      ) {
        throw notFound("incident");
      }

      throw err;
    });
}

export async function deleteRating(
  incidentId: bigint,
  customerId: bigint
): Promise<boolean> {
  const { affected } = await ratingsRepo()
    .createQueryBuilder()
    .andWhere("incident_id = :incidentId", { incidentId })
    .andWhere("customer_id = :customerId", { customerId })
    .delete()
    .execute();

  return !!affected;
}

export async function getIncidentRating(
  incidentId: bigint
): Promise<{
  positiveCount: number;
  negativeCount: number;
  lastRatedAt: Date;
}> {
  const res = await getConnection().query(
    `
    SELECT
      count(*) FILTER ( WHERE rating = 1 ) "positiveCount",
      count(*) FILTER ( WHERE rating = -1 ) "negativeCount",
      max(created_at) "lastRatedAt"
    FROM incident_ratings
    WHERE incident_id = $1
  `,
    [incidentId.toString()]
  );

  if (!res) {
    throw notFound("incident");
  }

  return res;
}

import { ServerRoute } from "@hapi/hapi";
import Joi from "@hapi/joi";
import {
  readTimetableFile,
  routesAndTripesNearby,
} from "../lib/timetable/timetable-service";
import { GeoPointValidation } from "../lib/geo-point/geo-point-validation";
import { GeoPoint } from "../lib/geo-point/geo-point";

export const timeTableRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/timetable/nearby",
    options: {
      tags: ["api"],
      description: "Returns Routes and Trips near provided point",
      validate: {
        query: GeoPointValidation().required(),
      },
    },
    handler: ({ query }) =>
      routesAndTripesNearby((query as unknown) as GeoPoint),
  },
  {
    method: "GET",
    path: "/timetable/{file}",
    options: {
      tags: ["api"],
      description: "Returns GTFS like timetable",
      validate: {
        params: {
          file: Joi.string()
            .valid(
              "agency",
              "calendar_dates",
              "calendar",
              "feed_info",
              "route_types",
              "vehicle_types",
              "routes",
              "trips"
            )
            .label("TimetableFiles"),
        },
      },
    },
    handler: ({ params: { file } }) => readTimetableFile(file as string),
  },
];

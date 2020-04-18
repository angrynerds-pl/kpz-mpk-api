import { ServerRoute } from "@hapi/hapi";
import Joi from "@hapi/joi";
import { readTimetableFile } from "../lib/timetable/timetable-service";

export const timeTableRoutes: ServerRoute[] = [
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
            .label("TimetableFiles")
        }
      }
    },
    handler: ({ params: { file } }) => readTimetableFile(file as string)
  }
];

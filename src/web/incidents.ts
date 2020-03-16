/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerRoute } from "@hapi/hapi";
import { string, object, number } from "@hapi/joi";
import {
  listIncidents,
  createIncident,
  getIncident
} from "../lib/incident/incidents-service";

export const incidentRoutes: readonly ServerRoute[] = [
  {
    method: "get",
    path: "/incidents",
    options: {
      tags: ["api"],
      description: "Lists incidents"
    },
    handler: listIncidents
  },
  {
    method: "get",
    path: "/incidents/{id}",
    options: {
      tags: ["api"],
      description: "Gets incident",
      validate: { params: object().keys({ id: string().regex(/^\d+$/) }) }
    },
    handler: ({ params }) => getIncident(params.id)
  },
  {
    method: "post",
    path: "/incidents",
    options: {
      tags: ["api"],
      description: "Creates incident",
      validate: {
        payload: object().keys({
          description: string().required(),
          userId: string().required(),
          type: number()
            .required()
            .valid(0, 1, 2, 3, 4, 5)
        })
      }
    },
    handler: ({ payload }) => createIncident(payload as any)
  }
];

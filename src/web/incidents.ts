/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerRoute } from "@hapi/hapi";
import Joi from "@hapi/joi";
import {
  listIncidents,
  createIncident,
  getIncident
} from "../lib/incident/incidents-service";
import { AuthorizedRequest } from "../core/authorized-request";

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
      validate: {
        params: Joi.object().keys({ id: Joi.string().regex(/^\d+$/) })
      }
    },
    handler: ({ params }) => getIncident(params.id)
  },
  {
    method: "post",
    path: "/incidents",
    options: {
      tags: ["api"],
      auth: "auth0",
      description: "Creates incident",
      validate: {
        payload: Joi.object().keys({
          description: Joi.string().required(),
          type: Joi.string()
            .required()
            .valid(
              "else",
              "derailment",
              "collision",
              "noelectricity",
              "trackdamage",
              "nopassage"
            ),
          location: Joi.object()
            .keys({
              longitude: Joi.number().required(),
              latitude: Joi.number().required()
            })
            .required()
        })
      }
    },
    handler: ({ payload, auth: { credentials } }: AuthorizedRequest) =>
      createIncident(credentials.customerId, payload as any)
  }
];

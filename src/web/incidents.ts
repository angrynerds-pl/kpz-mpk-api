/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerRoute } from "@hapi/hapi";
import Joi from "@hapi/joi";
import {
  createIncident,
  getIncident,
  listIncidents
} from "../lib/incident/incidents-service";
import { AuthorizedRequest } from "../core/authorized-request";
import { GeoPointValidation } from "../lib/geo-point/geo-point-validation";
import { BigIntValidation } from "../helpers/bigint-validation";
import { IncidentTypeValidation } from "../lib/incident/incident-type-validation";

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
        params: { id: BigIntValidation() }
      }
    },
    handler: ({ params }) => getIncident(params.id as any)
  },
  {
    method: "post",
    path: "/incidents",
    options: {
      tags: ["api"],
      auth: "auth0",
      description: "Creates incident",
      validate: {
        payload: Joi.object()
          .keys({
            description: Joi.string().required(),
            type: IncidentTypeValidation().required(),
            location: GeoPointValidation().required(),
            routeId: Joi.string().required(),
            tripHeadsign: Joi.string().required()
          })
          .label("CreateIncidentInput")
      }
    },
    handler: ({ payload, auth: { credentials } }: AuthorizedRequest) =>
      createIncident(credentials.customerId, payload as any)
  }
];

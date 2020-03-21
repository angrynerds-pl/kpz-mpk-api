/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerRoute } from "@hapi/hapi";
import Joi from "@hapi/joi";
import {
  listIncidents,
  createIncident,
  getIncident
} from "../lib/incident/incidents-service";
import { GeoPointValidation } from "../lib/geo-point/geo-point-validation";
import { StringIntValidation } from "../helpers/string-int-validation";
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
        params: Joi.object().keys({ id: StringIntValidation() })
      }
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
        payload: Joi.object()
          .keys({
            description: Joi.string().required(),
            type: IncidentTypeValidation().required(),
            location: GeoPointValidation().required()
          })
          .label("CreateIncidentInput")
      }
    },
    handler: ({ payload }) => createIncident(payload as any)
  }
];

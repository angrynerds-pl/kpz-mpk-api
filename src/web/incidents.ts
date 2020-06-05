/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerRoute } from "@hapi/hapi";
import Joi from "@hapi/joi";
import { notFound } from "@hapi/boom";
import {
  createIncident,
  rateIncident,
  deleteRating,
  getIncident,
  listActiveIncidents,
  listIncidentAffectedHeadsignsWithGtfsType,
  getIncidentRating,
  getIncidentRouteType,
  getCustomerIncidentRating
} from "../lib/incident/incidents-service";
import { AuthorizedRequest } from "../core/authorized-request";
import { GeoPointValidation } from "../lib/geo-point/geo-point-validation";
import { BigIntValidation } from "../helpers/bigint-validation";
import { IncidentTypeValidation } from "../lib/incident/incident-type-validation";
import { listComments } from "../lib/comment/comments-service";

export const incidentRoutes: readonly ServerRoute[] = [
  {
    method: "get",
    path: "/incidents",
    options: {
      tags: ["api"],
      description: "Lists incidents"
    },
    handler: listActiveIncidents
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
    method: "get",
    path: "/incidents/{id}/view",
    options: {
      tags: ["api"],
      auth: {
        strategy: "auth0",
        mode: "optional"
      },
      description: "Gets incident",
      validate: {
        params: { id: BigIntValidation() }
      }
    },
    handler: async ({ params, auth: { credentials } }: AuthorizedRequest) => {
      const incidentId = (params as any).id as bigint;
      const customerId: bigint | null = credentials?.customerId;

      const [
        incident,
        routeGtfsType,
        affectedHeadsigns,
        comments,
        maybeRating,
        myRating
      ] = await Promise.all([
        getIncident(incidentId),
        getIncidentRouteType(incidentId),
        listIncidentAffectedHeadsignsWithGtfsType(incidentId),
        listComments(incidentId),
        getIncidentRating(incidentId),
        customerId
          ? getCustomerIncidentRating(customerId, incidentId)
          : Promise.resolve(null)
      ]);

      const rating = maybeRating ?? {
        positiveCount: 0,
        negativeCount: 0,
        lastRatedAt: null
      };

      return {
        ...incident,
        routeGtfsType,
        affectedHeadsigns,
        comments,
        rating,
        myRating
      };
    }
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
  },
  {
    method: "post",
    path: "/incidents/{incidentId}/rating",
    options: {
      tags: ["api"],
      auth: "auth0",
      description: "Rates incident",
      validate: {
        params: { incidentId: BigIntValidation() },
        payload: Joi.object()
          .keys({
            rating: Joi.number()
              .required()
              .valid(-1, 1)
          })
          .label("IncidentRatingInput")
      }
    },
    handler: async (
      {
        params: { incidentId },
        payload,
        auth: {
          credentials: { customerId }
        }
      }: AuthorizedRequest,
      h
    ) => {
      const { rating } = payload as any;

      await rateIncident(incidentId as any, customerId, rating);

      return h.response().code(204);
    }
  },
  {
    method: "delete",
    path: "/incidents/{incidentId}/rating",
    options: {
      tags: ["api"],
      auth: "auth0",
      description: "Deletes rating",
      validate: {
        params: { incidentId: BigIntValidation() }
      }
    },
    handler: async (
      {
        params: { incidentId },
        auth: {
          credentials: { customerId }
        }
      }: AuthorizedRequest,
      h
    ) => {
      const isDeleted = await deleteRating(incidentId as any, customerId);

      if (!isDeleted) {
        throw notFound("incident_rating");
      }

      return h.response().code(204);
    }
  }
];

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerRoute } from "@hapi/hapi";
import Joi from "@hapi/joi";
import {
  listRatings,
  getRating,
  createRating
} from "../lib/rating/ratings-service";
import { AuthorizedRequest } from "../core/authorized-request";
import { BigIntValidation } from "../helpers/bigint-validation";

export const commentRoutes: readonly ServerRoute[] = [
  {
    method: "get",
    path: "/incidents/{incidentId}/ratings",
    options: {
      tags: ["api"],
      description: "Lists ratings",
      validate: {
        params: { incidentId: BigIntValidation() }
      }
    },
    handler: ({ params }) => listRatings(params.incidentId as any)
  },
  {
    method: "get",
    path: "/ratings/{id}",
    options: {
      tags: ["api"],
      description: "Gets rating",
      validate: {
        params: { id: BigIntValidation() }
      }
    },
    handler: ({ params }) => getRating(params.id as any)
  },
  {
    method: "post",
    path: "/incidents/{incidentId}/ratings",
    options: {
      tags: ["api"],
      auth: "auth0",
      description: "Creates rating",
      validate: {
        payload: Joi.object().keys({
          content: Joi.string().required()
        }),
        params: { incidentId: BigIntValidation() }
      }
    },
    handler: ({ payload, params, auth: { credentials } }: AuthorizedRequest) =>
      createRating(
        credentials.customerId,
        params.incidentId as any,
        payload as any
      )
  }
];

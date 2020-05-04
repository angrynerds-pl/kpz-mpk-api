/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerRoute } from "@hapi/hapi";
import Joi from "@hapi/joi";
import {
  listComments,
  createComment,
  getComment
} from "../lib/comment/comments-service";
import { AuthorizedRequest } from "../core/authorized-request";
import { BigIntValidation } from "../helpers/bigint-validation";

export const commentRoutes: readonly ServerRoute[] = [
  {
    method: "get",
    path: "/incidents/{incidentId}/comments",
    options: {
      tags: ["api"],
      description: "Lists comments",
      validate: {
        params: { incidentId: BigIntValidation() }
      }
    },
    handler: ({ params }) => listComments(params.incidentId as any)
  },
  {
    method: "get",
    path: "/comments/{id}",
    options: {
      tags: ["api"],
      description: "Gets comment",
      validate: {
        params: { id: BigIntValidation() }
      }
    },
    handler: ({ params }) => getComment(params.id as any)
  },
  {
    method: "post",
    path: "/incidents/{incidentId}/comments",
    options: {
      tags: ["api"],
      auth: "auth0",
      description: "Creates comment",
      validate: {
        payload: Joi.object().keys({
          content: Joi.string().required()
        }),
        params: { incidentId: BigIntValidation() }
      }
    },
    handler: ({ payload, params, auth: { credentials } }: AuthorizedRequest) =>
      createComment(
        credentials.customerId,
        params.incidentId as any,
        payload as any
      )
  }
];

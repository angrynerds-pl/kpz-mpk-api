/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerRoute } from "@hapi/hapi";
import Joi from "@hapi/joi";
import {
  listComments,
  createComment,
  getComment
} from "../lib/comment/comments-service";
import { BigIntValidation } from "../helpers/bigint-validation";

export const commentRoutes: readonly ServerRoute[] = [
  {
    method: "get",
    path: "/comments",
    options: {
      tags: ["api"],
      description: "Lists comments"
    },
    handler: listComments
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
    path: "/comments",
    options: {
      tags: ["api"],
      description: "Creates comment",
      validate: {
        payload: Joi.object()
          .keys({
            content: Joi.string().required()
          })
          .label("CreateCommentInput")
      }
    },
    handler: ({ payload }) => createComment(payload as any)
  }
];

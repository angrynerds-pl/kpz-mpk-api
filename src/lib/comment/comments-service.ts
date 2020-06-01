import { Repository, getRepository } from "typeorm";
import { notFound } from "@hapi/boom";
import { Comment } from "./comment";
import { transform } from "../../helpers/transform";

function repo(): Repository<Comment> {
  return getRepository(Comment);
}

export function listComments(incidentId: bigint): Promise<Comment[]> {
  return repo().find({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    incidentId: incidentId.toString() as any
  });
}

export async function getComment(id: bigint): Promise<Comment> {
  const comment = await repo().findOne(id.toString());
  if (!comment) throw notFound("comment_not_found");
  return comment;
}

export async function createComment(
  creatorId: bigint,
  incidentId: bigint,
  params: Partial<Comment>
): Promise<Comment> {
  const comment = transform(Comment, params);

  comment.creatorId = creatorId;
  comment.incidentId = incidentId;

  await repo().save(comment);

  // hide creatorId from the response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comment.creatorId = undefined as any;

  return comment;
}

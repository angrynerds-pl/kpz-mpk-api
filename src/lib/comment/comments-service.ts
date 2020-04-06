import { Repository, getRepository } from "typeorm";
import { notFound } from "@hapi/boom";
import { Comment } from "./comment";
import { transform } from "../../helpers/transform";

function repo(): Repository<Comment> {
  return getRepository(Comment);
}

export function listComments(): Promise<Comment[]> {
  return repo().find();
}

export async function getComment(id: bigint): Promise<Comment> {
  const comment = await repo().findOne(id.toString());
  if (!comment) throw notFound("comment_not_found");
  return comment;
}

export async function createComment(
  params: Partial<Comment>
): Promise<Comment> {
  const comment = transform(Comment, params);
  await repo().save(comment);
  return comment;
}

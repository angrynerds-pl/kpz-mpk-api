import { Repository, getRepository } from "typeorm";
import { notFound } from "@hapi/boom";
import { Rating } from "./rating";
import { transform } from "../../helpers/transform";

function repo(): Repository<Rating> {
  return getRepository(Rating);
}

export async function listRatings(incidentId: bigint): Promise<Rating[]> {
  const ratings = await repo().find({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    incidentId: incidentId.toString() as any
  });
  if (!ratings) throw notFound("rating_not_found");
  return ratings;
}

export async function getRating(id: bigint): Promise<Rating> {
  const rating = await repo().findOne(id.toString());
  if (!rating) throw notFound("rating_not_found");
  return rating;
}

export async function createRating(
  creatorId: bigint,
  incidentId: bigint,
  params: Partial<Rating>
): Promise<Rating> {
  const rating = transform(Rating, params);

  rating.creatorId = creatorId;
  rating.incidentId = incidentId;

  await repo().save(rating);

  // hide creatorId from the response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rating.creatorId = undefined as any;

  return rating;
}

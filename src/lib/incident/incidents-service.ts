import { Repository, getRepository } from "typeorm";
import { notFound } from "@hapi/boom";
import { Incident } from "./incident";
import { transform } from "../../helpers/transform";

function repo(): Repository<Incident> {
  return getRepository(Incident);
}

export function listIncidents(): Promise<Incident[]> {
  return repo().find();
}

export async function getIncident(id: string): Promise<Incident> {
  const incident = await repo().findOne(id);
  if (!incident) throw notFound("incident_not_found");
  return incident;
}

export async function createIncident(
  creatorId: string,
  params: Partial<Incident>
): Promise<Incident> {
  const incident = transform(Incident, params);

  incident.creatorId = creatorId;

  await repo().save(incident);

  // hide creatorId from the response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  incident.creatorId = undefined as any;

  return incident;
}

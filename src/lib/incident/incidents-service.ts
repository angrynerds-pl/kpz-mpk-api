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
  params: Pick<Incident, "description">
): Promise<Incident> {
  const incident = transform(Incident, params);
  await repo().save(incident);
  return incident;
}

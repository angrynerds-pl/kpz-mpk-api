import { Repository, getRepository } from "typeorm";
import { notFound } from "@hapi/boom";
import { Incident } from "./incident";
import { transform } from "../../helpers/transform";
import { queryHeadsignsOnThisTrack } from "../timetable/timetable-service";

function repo(): Repository<Incident> {
  return getRepository(Incident);
}

export function listIncidents(): Promise<Incident[]> {
  return repo().find();
}

export function listActiveIncidentsWithAffectedHeadsigns(): Promise<
  Incident[]
> {
  return repo()
    .createQueryBuilder("incident")
    .leftJoinAndSelect("incident.affectedHeadsigns", "affectedHeadsign")
    .where("now() - incident.created_at <= '1 hour'::interval")
    .getMany();
}

export async function getIncident(id: bigint): Promise<Incident> {
  const incident = await repo().findOne(id.toString());
  if (!incident) throw notFound("incident_not_found");
  return incident;
}

export async function getIncidentWithAffectedHeadsigns(
  id: bigint
): Promise<Incident> {
  const incident = await repo()
    .createQueryBuilder("incident")
    .leftJoinAndSelect("incident.affectedHeadsigns", "affectedHeadsign")
    .where("incident.id = :id", { id: id.toString() })
    .getOne();

  if (!incident) throw notFound("incident_not_found");
  return incident;
}

export async function createIncident(
  creatorId: bigint,
  params: Partial<Incident>
): Promise<Incident> {
  const incident = transform(Incident, params);

  incident.creatorId = creatorId;

  incident.affectedHeadsigns = (await queryHeadsignsOnThisTrack(
    incident.location,
    incident.routeId,
    incident.tripHeadsign
    // the result lacks incidentId but it is what we need for cascade insert
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  )) as any;

  if (incident.affectedHeadsigns.length === 0) {
    throw notFound("route_headsign_not_found");
  }

  await repo().save(incident);

  // hide creatorId from the response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  incident.creatorId = undefined as any;

  return incident;
}

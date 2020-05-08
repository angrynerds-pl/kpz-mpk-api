import { Entity, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";
import { Incident } from "./incident";

@Entity({ name: "incident_affected_headsigns" })
export class IncidentAffectedHeadsign {
  @PrimaryColumn({ name: "incident_id", type: "bigint" })
  incidentId!: bigint;

  @PrimaryColumn({ name: "route_id", type: "text" })
  routeId!: string;

  @PrimaryColumn({ name: "trip_headsign", type: "text" })
  tripHeadsign!: string;

  @JoinColumn({ name: "incident_id" })
  @ManyToOne(
    () => Incident,
    incident => incident.affectedHeadsigns
  )
  incident!: Incident;
}

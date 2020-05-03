import { Entity, PrimaryColumn, OneToMany } from "typeorm";
import { Incident } from "../incident/incident";

@Entity({ name: "timetable_headsigns" })
export class TimetableHeadsign {
  @PrimaryColumn({ name: "route_id", type: "text" })
  routeId!: string;

  @PrimaryColumn({ name: "trip_headsign", type: "text" })
  tripHeadsign!: string;

  @OneToMany(
    () => Incident,
    affectedHeadsign => affectedHeadsign.headsign
  )
  incidentAffectedHeadsigns!: Incident[];
}

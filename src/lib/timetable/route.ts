import { Entity, PrimaryColumn, Column, Check } from "typeorm";
import { TimetableRouteType } from "./route-type";

@Entity({ name: "timetable_route" })
export class TimetableRoute {
  @PrimaryColumn({ type: "text", name: "route_id" })
  routeId!: string;

  @Column({ type: "text", name: "agency_id" })
  agencyId!: string;

  @Column({ type: "text", name: "route_short_name" })
  routeShortName!: string;

  @Column({ type: "text", name: "route_desc" })
  routeDesc!: string;

  @Column({ type: "int2", name: "route_type" })
  @Check(
    "timetable_route__route_type__enum",
    `route_type IN (${Object.values(TimetableRouteType)
      .filter(value => typeof value === "number")
      .join(", ")})`
  )
  routeType!: TimetableRouteType;
}

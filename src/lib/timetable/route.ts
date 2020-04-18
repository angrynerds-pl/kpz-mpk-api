import { Entity, PrimaryColumn, Column } from "typeorm";

export enum TimetableRouteType {
  Tram = 0,
  Subway = 1,
  Rail = 2,
  Bus = 3,
  Ferry = 4,
  CableTram = 5,
  AerialLift = 6,
  Funicular = 7,
  Trolleybus = 11,
  Monorail = 12
}

@Entity({ name: "timetable_route" })
export class TimetableRoute {
  @PrimaryColumn({ type: "text", name: "route_id" })
  routeId!: string;

  @Column({ type: "text", name: "agency_id" })
  agencyId!: string;

  @Column({ type: "text", name: "route_short_name" })
  routeShortName!: string;

  @Column({ type: "text", name: "route_long_name" })
  routeLongName!: string;

  @Column({ type: "text", name: "route_desc" })
  routeDesc!: string;

  @Column({ type: "enum", enum: TimetableRouteType, name: "route_type" })
  routeType!: TimetableRouteType;
}

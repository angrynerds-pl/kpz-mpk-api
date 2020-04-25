import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "timetable_trips" })
export class TimetableTrip {
  @Column({ type: "text", name: "route_id" })
  routeId!: string;

  @Column({ type: "text", name: "service_id" })
  serviceId!: string;

  @PrimaryColumn({ type: "text", name: "trip_id" })
  trip_id!: string;

  @Column({ type: "text", name: "trip_headsign" })
  tripHeadsign!: string;

  @Column({ type: "text", name: "direction_id" })
  directionId!: string;

  @Column({ type: "text", name: "shape_id" })
  shapeId!: string;

  @Column({ type: "text", name: "brigade_id" })
  brigadeId!: string;

  @Column({ type: "text", name: "vehicle_id" })
  vehicleId!: string;

  @Column({ type: "text", name: "variant_id" })
  variantId!: string;
}

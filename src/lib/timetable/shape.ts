import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "timetable_shape" })
export class TimetableShape {
  @PrimaryColumn({ type: "text", name: "shape_id" })
  shapeId!: string;

  @Column({ type: "float8", name: "shape_pt_lat" })
  latitude!: number;

  @Column({ type: "float8", name: "shape_pt_lon" })
  longitude!: number;

  @PrimaryColumn({ type: "int4", name: "shape_pt_sequence" })
  sequence!: number;
}

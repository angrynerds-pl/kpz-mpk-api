import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Expose } from "class-transformer";
import { Point } from "geojson";

export enum IncidentType {
  Else,
  Derailment,
  Collision,
  NoElectricity,
  TrackDamage,
  NoPassage
}

@Entity({ name: "incidents" })
export class Incident {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "text" })
  @Expose()
  description!: string;

  @Column({ type: "bigint" })
  userId!: string;

  @Column({
    type: "enum",
    enum: IncidentType,
    default: IncidentType.Else
  })
  type!: IncidentType;

  @Column({
    type: "point",
    transformer: {
      from: coordinates => coordinates,
      to: coordinates => `${coordinates.longitude}, ${coordinates.latitude}`
    }
  })
  location!: Point;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;
}

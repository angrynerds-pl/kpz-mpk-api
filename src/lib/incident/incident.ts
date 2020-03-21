import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Expose } from "class-transformer";
import { Point } from "../point/point";
import { pointTransformer } from "../point/point-transformer";

export enum IncidentType {
  ELSE = "else",
  DERAILMENT = "derailment",
  COLLISION = "collision",
  NOELECTRICITY = "noelectricity",
  TRACKDAMAGE = "trackdamage",
  NOPASSAGE = "nopassage"
}

@Entity({ name: "incidents" })
export class Incident {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "text" })
  @Expose()
  description!: string;

  @Column({
    type: "enum",
    enum: IncidentType,
    default: IncidentType.ELSE
  })
  @Expose()
  type!: IncidentType;

  @Column({
    type: "point",
    transformer: pointTransformer
  })
  @Expose()
  location!: Point;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;
}

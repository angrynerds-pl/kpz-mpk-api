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
import { IncidentType } from "./incident-type";

@Entity({ name: "incidents" })
export class Incident {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "text" })
  @Expose()
  description!: string;

  @Column({
    type: "enum",
    enum: IncidentType
  })
  @Expose()
  type!: IncidentType;

  @Column({
    type: "point",
    transformer: pointTransformer
  })
  @Expose()
  location!: Point;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt!: Date;
}

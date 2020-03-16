import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Expose } from "class-transformer";

export enum IncidentType {
  Else,
  Derailment,
  Collision,
  NoElectricity,
  TrackDamage,
  NoPassage
}

// export interface Point {
//   lat: string;
//   lon: string;
// }

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

  // @Column({ type: "point" })
  // location!: Point;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;
}

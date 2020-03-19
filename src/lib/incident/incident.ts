import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Expose } from "class-transformer";

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
    transformer: {
      from: (location: GeoJSON.Point) => location,
      to: (location: { latitude: string; longitude: string }) => ({
        type: "Point",
        coordinates: [
          parseFloat(location.longitude),
          parseFloat(location.latitude)
        ]
      })
    }
  })
  @Expose()
  location!: GeoJSON.Point;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;
}

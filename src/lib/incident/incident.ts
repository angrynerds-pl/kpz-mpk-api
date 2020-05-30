import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index
} from "typeorm";
import { Expose } from "class-transformer";
import { IncidentType } from "./incident-type";
import { GeoPointTransformer } from "../geo-point/geo-point-transformer";
import { GeoPoint } from "../geo-point/geo-point";
import { Customer } from "../customer/customer";
import { IncidentAffectedHeadsign } from "./incident-affected-headsign";
import { Comment } from "../comment/comment";
import { IncidentRating } from "./incident-rating";

@Entity({ name: "incidents" })
export class Incident {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: bigint;

  @Column({ name: "creator_id", select: false })
  creatorId!: bigint;

  @JoinColumn({ name: "creator_id" })
  @ManyToOne(
    () => Customer,
    customer => customer.incidents
  )
  creator!: Customer;

  @OneToMany(
    () => IncidentRating,
    rating => rating.incident
  )
  ratings!: IncidentRating[];

  @OneToMany(
    () => Comment,
    comment => comment.incident
  )
  comments!: Comment[];

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
    transformer: GeoPointTransformer
  })
  @Expose()
  location!: GeoPoint;

  @Column({ name: "route_id", type: "text" })
  @Expose()
  routeId!: string;

  @Column({ name: "trip_headsign", type: "text" })
  @Expose()
  tripHeadsign!: string;

  @OneToMany(
    () => IncidentAffectedHeadsign,
    affectedHeadsign => affectedHeadsign.incident,
    { cascade: true }
  )
  affectedHeadsigns!: IncidentAffectedHeadsign[];

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  @Index()
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt!: Date;
}

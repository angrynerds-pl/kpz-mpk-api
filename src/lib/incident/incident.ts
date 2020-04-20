import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { Expose } from "class-transformer";
import { IncidentType } from "./incident-type";
import { GeoPointTransformer } from "../geo-point/geo-point-transformer";
import { GeoPoint } from "../geo-point/geo-point";
import { Customer } from "../customer/customer";
import { Comment } from "../comment/comment";

@Entity({ name: "incidents" })
export class Incident {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: bigint;

  @Column({ name: "creator_id", select: false })
  creatorId!: bigint;

  @JoinColumn({ name: "creator_id" })
  @ManyToOne(
    () => Customer,
    customer => customer.incidents,
    {}
  )
  creator!: Customer;

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

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt!: Date;
}

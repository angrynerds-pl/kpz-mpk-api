import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { Expose } from "class-transformer";
import { Incident } from "../incident/incident";
import { Customer } from "../customer/customer";
import { RatingType } from "./rating-type";

@Entity({ name: "ratings" })
export class Rating {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: bigint;

  @Column({ name: "creator_id", select: false })
  creatorId!: bigint;

  @JoinColumn({ name: "creator_id" })
  @ManyToOne(() => Customer)
  creator!: Customer;

  @Column({ name: "incident_id" })
  incidentId!: bigint;

  @JoinColumn({ name: "incident_id" })
  @ManyToOne(
    () => Incident,
    incident => incident.ratings
  )
  incident!: Incident;

  @Column({
    type: "enum",
    enum: RatingType
  })
  @Expose()
  rating!: RatingType;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt!: Date;
}

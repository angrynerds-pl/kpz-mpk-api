import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  Column,
  Check
} from "typeorm";
import { Incident } from "./incident";
import { Customer } from "../customer/customer";

@Entity({ name: "incident_ratings" })
export class IncidentRating {
  @PrimaryColumn({ name: "incident_id", type: "bigint" })
  incidentId!: bigint;

  @PrimaryColumn({ name: "customer_id", type: "bigint" })
  customerId!: bigint;

  @JoinColumn({ name: "incident_id" })
  @ManyToOne(
    () => Incident,
    incident => incident.ratings
  )
  incident!: Incident;

  @JoinColumn({ name: "customer_id" })
  @ManyToOne(
    () => Customer,
    customer => customer.ratings
  )
  customer!: Customer;

  @Column({ type: "smallint" })
  @Check("rating = -1 OR rating = 1")
  rating!: -1 | 1;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt!: Date;
}

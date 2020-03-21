import { PrimaryGeneratedColumn, Entity, Column, OneToMany } from "typeorm";
import { Incident } from "../incident/incident";

@Entity({ name: "customers" })
export class Customer {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ name: "auth0_id", type: "text", unique: true })
  auth0Id!: string;

  @OneToMany(
    () => Incident,
    incident => incident.creator
  )
  incidents!: Incident[];
}

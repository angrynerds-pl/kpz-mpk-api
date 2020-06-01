import { PrimaryGeneratedColumn, Entity, Column, OneToMany } from "typeorm";
import { Expose } from "class-transformer";
import { Incident } from "../incident/incident";
import { Comment } from "../comment/comment";
import { IncidentRating } from "../incident/incident-rating";

@Entity({ name: "customers" })
export class Customer {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: bigint;

  @Column({ name: "auth0_id", type: "text", unique: true })
  @Expose()
  auth0Id!: string;

  @OneToMany(
    () => Incident,
    incident => incident.creator
  )
  incidents!: Incident[];

  @OneToMany(
    () => IncidentRating,
    rating => rating.incident
  )
  ratings!: IncidentRating[];

  @OneToMany(
    () => Comment,
    comment => comment.creator
  )
  comments!: Comment[];
}

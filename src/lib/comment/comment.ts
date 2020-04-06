import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Expose } from "class-transformer";
import { Incident } from "../incident/incident";

@Entity({ name: "comments" })
export class Comment {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: bigint;

  @Column({ name: "incident" })
  incident!: Incident;

  @Column({ name: "creator_id", select: false })
  creatorId!: bigint;

  @Column({ type: "text" })
  @Expose()
  content!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt!: Date;
}

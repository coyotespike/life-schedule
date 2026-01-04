import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Event } from "./Event";
import { Contact } from "./Contact";

export enum RSVPStatus {
  PENDING = "pending",
  ATTENDING = "attending",
  MAYBE = "maybe",
  DECLINED = "declined",
}

@Entity()
export class EventInvitation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  eventId!: number;

  @ManyToOne(() => Event)
  @JoinColumn({ name: "eventId" })
  event!: Event;

  @Column()
  contactId!: number;

  @ManyToOne(() => Contact)
  @JoinColumn({ name: "contactId" })
  contact!: Contact;

  @Column({
    type: "enum",
    enum: RSVPStatus,
    default: RSVPStatus.PENDING,
  })
  rsvpStatus!: RSVPStatus;

  @Column({ type: "timestamp", nullable: true })
  respondedAt!: Date | null;

  @Column({ type: "text", nullable: true })
  responseNote!: string | null; // Optional note from the contact

  @Column({ type: "boolean", default: false })
  isManualResponse!: boolean; // True if manually logged, false if automatic
}


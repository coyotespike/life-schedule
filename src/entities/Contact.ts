import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  // TODO: add validation when we write CRUD
  @Column()
  phoneNumber!: string;

  @Column()
  userId!: number;

  @Column({ type: "int", nullable: true })
  birthMonth?: number; // 1-12, optional

  @Column({ type: "int", nullable: true })
  birthDay?: number; // 1-31, optional

  @Column({ type: "int", nullable: true })
  birthYear?: number; // Optional year
}

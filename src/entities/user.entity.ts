/* eslint-disable prettier/prettier */

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    unique: true,
  })
  email!: string;

    @Column({
    select: false,
    })
    password!: string;

  @Column()
  name!: string;

  @Column({
    nullable: true,
  })
  phone?: string;

  @Column({
    default: true,
  })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToMany(() => Role, (role) => role.users, {
    eager: true,
  })
  @JoinTable()
  roles!: Role[];
}
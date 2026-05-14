/* eslint-disable prettier/prettier */

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    unique: true,
  })
  role_name!: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @CreateDateColumn()
  created_at!: Date;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];
}
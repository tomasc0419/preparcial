/* eslint-disable prettier/prettier */

import 'dotenv/config';

import { DataSource } from 'typeorm';

import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

export default new DataSource({
  type: 'postgres',

  host: 'localhost',

  port: 5432,

  username: 'postgres',

  password: 'postgres',

  database: 'preparcial_db',

  entities: [User, Role],

  migrations: ['src/migrations/*.ts'],

  synchronize: false,
});
/* eslint-disable prettier/prettier */

import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

export class Init1747170000000
  implements MigrationInterface
{
  name = 'Init1747170000000';

  public async up(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "role" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "role_name" character varying NOT NULL,
        "description" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_role_name" UNIQUE ("role_name"),
        CONSTRAINT "PK_role_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "name" character varying NOT NULL,
        "phone" character varying,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "user_roles_role" (
        "userId" uuid NOT NULL,
        "roleId" uuid NOT NULL,
        CONSTRAINT "PK_user_roles" PRIMARY KEY ("userId", "roleId")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "user_roles_role"
      ADD CONSTRAINT "FK_user"
      FOREIGN KEY ("userId")
      REFERENCES "user"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "user_roles_role"
      ADD CONSTRAINT "FK_role"
      FOREIGN KEY ("roleId")
      REFERENCES "role"("id")
      ON DELETE CASCADE
    `);
  }

  public async down(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "user_roles_role"
    `);

    await queryRunner.query(`
      DROP TABLE "user"
    `);

    await queryRunner.query(`
      DROP TABLE "role"
    `);
  }
}
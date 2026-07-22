import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomersTable1784690062819 implements MigrationInterface {
  name = 'CreateCustomersTable1784690062819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."customers_tier_enum" AS ENUM('FREE', 'PRO', 'ENTERPRISE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."customers_status_enum" AS ENUM('ACTIVE', 'SUSPENDED', 'DELETED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying(255) NOT NULL, "email" character varying(320) NOT NULL, "tier" "public"."customers_tier_enum" NOT NULL, "status" "public"."customers_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TYPE "public"."customers_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."customers_tier_enum"`);
  }
}

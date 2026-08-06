import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBillingTables1784700000001 implements MigrationInterface {
  name = 'CreateBillingTables1784700000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."invoices_status_enum" AS ENUM('OPEN', 'PAID', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."invoices_plan_enum" AS ENUM('FREE', 'PRO', 'ENTERPRISE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."refunds_status_enum" AS ENUM('PENDING', 'COMPLETED', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."billing_accounts_plan_enum" AS ENUM('FREE', 'PRO', 'ENTERPRISE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoices" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "customer_id" uuid NOT NULL, "amount" numeric(12,2) NOT NULL, "status" "public"."invoices_status_enum" NOT NULL, "plan" "public"."invoices_plan_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_invoices" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "credits" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "customer_id" uuid NOT NULL, "amount" numeric(12,2) NOT NULL, "reason" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_credits" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refunds" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "customer_id" uuid NOT NULL, "invoice_id" uuid, "amount" numeric(12,2) NOT NULL, "status" "public"."refunds_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_refunds" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "billing_accounts" ("customer_id" uuid NOT NULL, "plan" "public"."billing_accounts_plan_enum" NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_billing_accounts" PRIMARY KEY ("customer_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "billing_accounts"`);
    await queryRunner.query(`DROP TABLE "refunds"`);
    await queryRunner.query(`DROP TABLE "credits"`);
    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TYPE "public"."billing_accounts_plan_enum"`);
    await queryRunner.query(`DROP TYPE "public"."refunds_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."invoices_plan_enum"`);
    await queryRunner.query(`DROP TYPE "public"."invoices_status_enum"`);
  }
}

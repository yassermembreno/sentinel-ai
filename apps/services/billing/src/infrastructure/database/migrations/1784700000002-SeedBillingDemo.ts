import { MigrationInterface, QueryRunner } from 'typeorm';

/** Demo seed: billing account + disputed invoice for Juan Pérez (fixed customer UUID). */
export class SeedBillingDemo1784700000002 implements MigrationInterface {
  name = 'SeedBillingDemo1784700000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "billing_accounts" ("customer_id", "plan")
      VALUES ('11111111-1111-4111-8111-111111111111', 'PRO')
      ON CONFLICT ("customer_id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "invoices" ("id", "customer_id", "amount", "status", "plan")
      VALUES (
        '33333333-3333-4333-8333-333333333333',
        '11111111-1111-4111-8111-111111111111',
        1250.00,
        'OPEN',
        'PRO'
      )
      ON CONFLICT ("id") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "invoices" WHERE "id" = '33333333-3333-4333-8333-333333333333'`,
    );
    await queryRunner.query(
      `DELETE FROM "billing_accounts" WHERE "customer_id" = '11111111-1111-4111-8111-111111111111'`,
    );
  }
}

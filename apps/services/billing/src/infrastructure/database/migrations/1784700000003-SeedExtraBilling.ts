import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Billing fixtures for María (LLM01) and Carlos (catalog).
 * Juan Pérez billing remains in SeedBillingDemo.
 */
export class SeedExtraBilling1784700000003 implements MigrationInterface {
  name = 'SeedExtraBilling1784700000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "billing_accounts" ("customer_id", "plan")
      VALUES
        ('44444444-4444-4444-8444-444444444444', 'PRO'),
        ('77777777-7777-4777-8777-777777777777', 'ENTERPRISE')
      ON CONFLICT ("customer_id") DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO "invoices" ("id", "customer_id", "amount", "status", "plan")
      VALUES
        (
          '66666666-6666-4666-8666-666666666666',
          '44444444-4444-4444-8444-444444444444',
          890.00,
          'OPEN',
          'PRO'
        ),
        (
          '99999999-9999-4999-8999-999999999999',
          '77777777-7777-4777-8777-777777777777',
          4200.00,
          'OPEN',
          'ENTERPRISE'
        )
      ON CONFLICT ("id") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "invoices"
      WHERE "id" IN (
        '66666666-6666-4666-8666-666666666666',
        '99999999-9999-4999-8999-999999999999'
      )
    `);
    await queryRunner.query(`
      DELETE FROM "billing_accounts"
      WHERE "customer_id" IN (
        '44444444-4444-4444-8444-444444444444',
        '77777777-7777-4777-8777-777777777777'
      )
    `);
  }
}

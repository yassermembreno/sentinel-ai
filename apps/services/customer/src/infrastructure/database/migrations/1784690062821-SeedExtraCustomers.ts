import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Extra demo customers:
 * - María Gómez → LLM01 prompt-injection fixture
 * - Carlos Ruiz → catalog / search (not scenario-primary)
 */
export class SeedExtraCustomers1784690062821 implements MigrationInterface {
  name = 'SeedExtraCustomers1784690062821';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "customers" ("id", "name", "email", "tier", "status")
      VALUES
        (
          '44444444-4444-4444-8444-444444444444',
          'María Gómez',
          'maria.gomez@example.com',
          'PRO',
          'ACTIVE'
        ),
        (
          '77777777-7777-4777-8777-777777777777',
          'Carlos Ruiz',
          'carlos.ruiz@example.com',
          'ENTERPRISE',
          'ACTIVE'
        )
      ON CONFLICT ("id") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "customers"
      WHERE "id" IN (
        '44444444-4444-4444-8444-444444444444',
        '77777777-7777-4777-8777-777777777777'
      )
    `);
  }
}

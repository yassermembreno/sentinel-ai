import { MigrationInterface, QueryRunner } from 'typeorm';

/** Demo seed: Juan Pérez (fixed UUID shared with billing/ticket fixtures). */
export class SeedCustomerDemo1784690062820 implements MigrationInterface {
  name = 'SeedCustomerDemo1784690062820';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "customers" ("id", "name", "email", "tier", "status")
      VALUES (
        '11111111-1111-4111-8111-111111111111',
        'Juan Pérez',
        'juan.perez@example.com',
        'PRO',
        'ACTIVE'
      )
      ON CONFLICT ("id") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "customers" WHERE "id" = '11111111-1111-4111-8111-111111111111'`,
    );
  }
}

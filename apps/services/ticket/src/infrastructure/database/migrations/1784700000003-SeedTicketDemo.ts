import { MigrationInterface, QueryRunner } from 'typeorm';

/** Demo seed: open ticket for Juan Pérez (fixed customer UUID). */
export class SeedTicketDemo1784700000003 implements MigrationInterface {
  name = 'SeedTicketDemo1784700000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "tickets" ("id", "customer_id", "subject", "status", "priority")
      VALUES (
        '22222222-2222-4222-8222-222222222222',
        '11111111-1111-4111-8111-111111111111',
        'Incorrect charge on last invoice',
        'OPEN',
        'HIGH'
      )
      ON CONFLICT ("id") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "tickets" WHERE "id" = '22222222-2222-4222-8222-222222222222'`,
    );
  }
}

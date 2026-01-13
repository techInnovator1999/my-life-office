import { MigrationInterface, QueryRunner } from 'typeorm';

export class LAPADM16RenameCarrierAgentCommissionsTomasterPaycodeMapping1757318289053
  implements MigrationInterface
{
  name =
    'LAPADM16RenameCarrierAgentCommissionsTomasterPaycodeMapping1757318289053';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "master_paycode_mapping" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "masterPaycodeId" uuid NOT NULL, "paycodeId" uuid NOT NULL, CONSTRAINT "PK_166c3c5c6c8f12eba6392e90a88" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_paycode_mapping" ADD CONSTRAINT "FK_48f139075237f9e8b5b29d03b22" FOREIGN KEY ("masterPaycodeId") REFERENCES "master_paycode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_paycode_mapping" ADD CONSTRAINT "FK_22b8feeddeecdf88de5a660c9ba" FOREIGN KEY ("paycodeId") REFERENCES "paycode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_paycode_mapping" DROP CONSTRAINT "FK_22b8feeddeecdf88de5a660c9ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_paycode_mapping" DROP CONSTRAINT "FK_48f139075237f9e8b5b29d03b22"`,
    );
    await queryRunner.query(`DROP TABLE "master_paycode_mapping"`);
  }
}

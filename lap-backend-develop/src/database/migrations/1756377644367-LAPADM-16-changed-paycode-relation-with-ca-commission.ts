import { MigrationInterface, QueryRunner } from 'typeorm';

export class LAPADM16ChangedPaycodeRelationWithCaCommission1756377644367
  implements MigrationInterface
{
  name = 'LAPADM16ChangedPaycodeRelationWithCaCommission1756377644367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "FK_9b202375c3afe3aae0fbbc6bb98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "UQ_9b202375c3afe3aae0fbbc6bb98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "FK_9b202375c3afe3aae0fbbc6bb98" FOREIGN KEY ("paycodeId") REFERENCES "paycode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "FK_9b202375c3afe3aae0fbbc6bb98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "UQ_9b202375c3afe3aae0fbbc6bb98" UNIQUE ("paycodeId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "FK_9b202375c3afe3aae0fbbc6bb98" FOREIGN KEY ("paycodeId") REFERENCES "paycode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}

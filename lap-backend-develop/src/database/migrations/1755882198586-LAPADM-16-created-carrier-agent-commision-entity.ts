import { MigrationInterface, QueryRunner } from 'typeorm';

export class LAPADM16AssociateMasterPaycodeLevelToCarrierAgentCommision1755882198586
  implements MigrationInterface
{
  name = 'LAPADM16AssociateMasterPaycodeToCarrierAgentCommision1755882198586';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "carrier_agent_commission" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "masterPaycodeId" uuid, "carrierId" uuid, "productCommissionId" uuid, CONSTRAINT "PK_e3b88391ec30c52770887220215" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "FK_f96cd26558e221eba2a8a4cdd70" FOREIGN KEY ("masterPaycodeId") REFERENCES "master_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "FK_a3cdf73b521b8205def9c625829" FOREIGN KEY ("carrierId") REFERENCES "carrier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "FK_6626c31216e0b068a55740e66bf" FOREIGN KEY ("productCommissionId") REFERENCES "product_commission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "FK_6626c31216e0b068a55740e66bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "FK_a3cdf73b521b8205def9c625829"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "FK_f96cd26558e221eba2a8a4cdd70"`,
    );
    await queryRunner.query(`DROP TABLE "carrier_agent_commission"`);
  }
}

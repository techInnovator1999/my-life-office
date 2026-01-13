import { MigrationInterface, QueryRunner } from 'typeorm';

export class LAPADM16RenameMasterLevelToMasterPaycode1756738786244
  implements MigrationInterface
{
  name = 'LAPADM16RenameMasterLevelToMasterPaycode1756738786244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "FK_f96cd26558e221eba2a8a4cdd70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" DROP CONSTRAINT "FK_82b9305e5b5760683eb0cedecd6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" DROP CONSTRAINT "UQ_82de488539f9c2281ef3fe98fe6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" ADD CONSTRAINT "UQ_509cd271ef2836dfbfda8f2eda5" UNIQUE ("companyId", "masterPaycodeId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "FK_0731b6cf9287f407710966a47be" FOREIGN KEY ("masterPaycodeId") REFERENCES "master_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" ADD CONSTRAINT "FK_dcee0a327bbcdc287dbb518722d" FOREIGN KEY ("masterPaycodeId") REFERENCES "master_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_master_level" DROP CONSTRAINT "FK_dcee0a327bbcdc287dbb518722d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "FK_0731b6cf9287f407710966a47be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" DROP CONSTRAINT "UQ_509cd271ef2836dfbfda8f2eda5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" RENAME COLUMN "masterPaycodeId" TO "masterPaycodeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" RENAME COLUMN "masterPaycodeId" TO "masterPaycodeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" ADD CONSTRAINT "UQ_82de488539f9c2281ef3fe98fe6" UNIQUE ("companyId", "masterPaycodeId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" ADD CONSTRAINT "FK_82b9305e5b5760683eb0cedecd6" FOREIGN KEY ("masterPaycodeId") REFERENCES "master_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "FK_f96cd26558e221eba2a8a4cdd70" FOREIGN KEY ("masterPaycodeId") REFERENCES "master_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}

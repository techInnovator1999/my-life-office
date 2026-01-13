import { MigrationInterface, QueryRunner } from 'typeorm';

export class LAPADM16RenamedLevelToMasterPaycode1756740209141
  implements MigrationInterface
{
  name = 'LAPADM16RenamedLevelToMasterPaycode1756740209141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing FKs pointing to master_level
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "FK_0731b6cf9287f407710966a47be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" DROP CONSTRAINT "FK_dcee0a327bbcdc287dbb518722d"`,
    );

    // Rename table instead of creating a new one
    await queryRunner.query(
      `ALTER TABLE "master_level" RENAME TO "master_paycode"`,
    );

    // Recreate FKs pointing to master_paycode
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "FK_0731b6cf9287f407710966a47be" FOREIGN KEY ("masterPaycodeId") REFERENCES "master_paycode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" ADD CONSTRAINT "FK_dcee0a327bbcdc287dbb518722d" FOREIGN KEY ("masterPaycodeId") REFERENCES "master_paycode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FKs pointing to master_paycode
    await queryRunner.query(
      `ALTER TABLE "company_master_level" DROP CONSTRAINT "FK_dcee0a327bbcdc287dbb518722d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "FK_0731b6cf9287f407710966a47be"`,
    );

    // Rename table back
    await queryRunner.query(
      `ALTER TABLE "master_paycode" RENAME TO "master_level"`,
    );

    // Restore FKs pointing back to master_level
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "FK_0731b6cf9287f407710966a47be" FOREIGN KEY ("masterPaycodeId") REFERENCES "master_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" ADD CONSTRAINT "FK_dcee0a327bbcdc287dbb518722d" FOREIGN KEY ("masterPaycodeId") REFERENCES "master_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}

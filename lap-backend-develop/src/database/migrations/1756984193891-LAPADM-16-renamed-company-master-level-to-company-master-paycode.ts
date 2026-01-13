import { MigrationInterface, QueryRunner } from 'typeorm';

export class LAPADM16RenamedCompanyMasterLevelToCompanyMasterPaycode1756984193891
  implements MigrationInterface
{
  name = 'LAPADM16RenamedCompanyMasterLevelToCompanyMasterPaycode1756984193891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company_master_paycode" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying, "companyId" uuid, "masterPaycodeId" uuid, CONSTRAINT "UQ_c31c00478dcb707c05a09722d8b" UNIQUE ("companyId", "masterPaycodeId"), CONSTRAINT "PK_c27f3c44ecd4f8dd92caf3a420d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "master_paycode_serial_seq" OWNED BY "master_paycode"."serial"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_paycode" ALTER COLUMN "serial" SET DEFAULT nextval('"master_paycode_serial_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_paycode" ALTER COLUMN "serial" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_paycode" ADD CONSTRAINT "FK_f96a1a2f1deec6484d00ca8d5bd" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_paycode" ADD CONSTRAINT "FK_f8fc9596ecad1c75f59b9503b4c" FOREIGN KEY ("masterPaycodeId") REFERENCES "master_paycode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_master_paycode" DROP CONSTRAINT "FK_f8fc9596ecad1c75f59b9503b4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_paycode" DROP CONSTRAINT "FK_f96a1a2f1deec6484d00ca8d5bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_paycode" ALTER COLUMN "serial" SET DEFAULT nextval('master_level_serial_seq')`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_paycode" ALTER COLUMN "serial" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "master_paycode_serial_seq"`);
    await queryRunner.query(`DROP TABLE "company_master_paycode"`);
  }
}

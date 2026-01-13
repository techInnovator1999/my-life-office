import { MigrationInterface, QueryRunner } from 'typeorm';

export class LAPADM16MakePaycodeTypeMandatory1756985370044
  implements MigrationInterface
{
  name = 'LAPADM16MakePaycodeTypeMandatory1756985370044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "master_paycode_serial_seq" OWNED BY "master_paycode"."serial"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_paycode" ALTER COLUMN "serial" SET DEFAULT nextval('"master_paycode_serial_seq"')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_paycode" ALTER COLUMN "serial" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "master_paycode_serial_seq"`);
  }
}

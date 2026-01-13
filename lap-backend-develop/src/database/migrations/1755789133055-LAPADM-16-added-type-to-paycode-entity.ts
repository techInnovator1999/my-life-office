import { MigrationInterface, QueryRunner } from 'typeorm';

export class LAPADM16AddedTypeToPaycodeEntity1755789133055
  implements MigrationInterface
{
  name = 'LAPADM16AddedTypeToPaycodeEntity1755789133055';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."paycode_type_enum" AS ENUM('DEFAULT', 'CUSTOM')`,
    );
    await queryRunner.query(
      `ALTER TABLE "paycode" ADD "type" "public"."paycode_type_enum" NOT NULL DEFAULT 'DEFAULT'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "paycode" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."paycode_type_enum"`);
  }
}

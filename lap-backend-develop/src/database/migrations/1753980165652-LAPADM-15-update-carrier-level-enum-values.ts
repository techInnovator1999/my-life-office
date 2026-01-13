import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCarrierLevelEnumValues1753980165652
  implements MigrationInterface
{
  name = 'UpdateCarrierLevelEnumValues1753980165652';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."carrier_level_enum" RENAME TO "carrier_level_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."carrier_level_enum" AS ENUM('Level 1', 'Level 2', 'Level 3', 'Hide', 'Top', 'Mid', 'TBD')`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier" ALTER COLUMN "level" TYPE "public"."carrier_level_enum" USING "level"::"text"::"public"."carrier_level_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."carrier_level_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."carrier_level_enum_old" AS ENUM('Level 1', 'Level 2', 'Level 3', 'TBD')`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier" ALTER COLUMN "level" TYPE "public"."carrier_level_enum_old" USING "level"::"text"::"public"."carrier_level_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."carrier_level_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."carrier_level_enum_old" RENAME TO "carrier_level_enum"`,
    );
  }
}

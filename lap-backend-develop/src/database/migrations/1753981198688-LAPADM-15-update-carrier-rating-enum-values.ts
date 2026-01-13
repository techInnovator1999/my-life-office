import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCarrierRatingEnumValues1753981198688
  implements MigrationInterface
{
  name = 'UpdateCarrierRatingEnumValues1753981198688';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."carrier_rating_enum" RENAME TO "carrier_rating_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."carrier_rating_enum" AS ENUM('0', '1', '2', '3', '4', '5')`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier" ALTER COLUMN "rating" TYPE "public"."carrier_rating_enum" USING "rating"::"text"::"public"."carrier_rating_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."carrier_rating_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."carrier_rating_enum_old" AS ENUM('1', '2', '3', '4', '5')`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier" ALTER COLUMN "rating" TYPE "public"."carrier_rating_enum_old" USING "rating"::"text"::"public"."carrier_rating_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."carrier_rating_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."carrier_rating_enum_old" RENAME TO "carrier_rating_enum"`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class LAPADM15UpdateProductLengthEnum1754482241936
  implements MigrationInterface
{
  name = 'LAPADM15UpdateProductLengthEnum1754482241936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "lengths"`);
    await queryRunner.query(
      `CREATE TYPE "public"."product_lengths_enum" AS ENUM('Perm', 'Term', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '35', '40', '80', '120', 'LifeTime', 'Other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "lengths" "public"."product_lengths_enum" array NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "lengths"`);
    await queryRunner.query(`DROP TYPE "public"."product_lengths_enum"`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD "lengths" text array NOT NULL`,
    );
  }
}

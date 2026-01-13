import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPercentageToMasterPaycode1755016022326
  implements MigrationInterface
{
  name = 'AddPercentageToMasterPaycode1755016022326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_level" ADD "percentage" numeric NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_level" DROP COLUMN "percentage"`,
    );
  }
}

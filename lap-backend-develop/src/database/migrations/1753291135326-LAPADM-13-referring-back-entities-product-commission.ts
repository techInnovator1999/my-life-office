import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReferringBackEntitiesProductCommission1753291135326
  implements MigrationInterface
{
  name = 'ReferringBackEntitiesProductCommission1753291135326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_commission" DROP CONSTRAINT "FK_79d03521b97d9f91574cdd45818"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_commission" DROP CONSTRAINT "FK_c0bfd01e7d9a854fb29988d98bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_commission" ALTER COLUMN "productId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_commission" ALTER COLUMN "paycodeId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_commission" ADD CONSTRAINT "FK_79d03521b97d9f91574cdd45818" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_commission" ADD CONSTRAINT "FK_c0bfd01e7d9a854fb29988d98bc" FOREIGN KEY ("paycodeId") REFERENCES "paycode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_commission" DROP CONSTRAINT "FK_c0bfd01e7d9a854fb29988d98bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_commission" DROP CONSTRAINT "FK_79d03521b97d9f91574cdd45818"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_commission" ALTER COLUMN "paycodeId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_commission" ALTER COLUMN "productId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_commission" ADD CONSTRAINT "FK_c0bfd01e7d9a854fb29988d98bc" FOREIGN KEY ("paycodeId") REFERENCES "paycode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_commission" ADD CONSTRAINT "FK_79d03521b97d9f91574cdd45818" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

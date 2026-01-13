import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFkConstraintInDtNames21753876978076
  implements MigrationInterface
{
  name = 'UpdateFkConstraintInDtNames21753876978076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "deposit_type_name" DROP CONSTRAINT "FK_099d5280064109969b7dcd6fc58"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deposit_type_name" ADD CONSTRAINT "FK_099d5280064109969b7dcd6fc58" FOREIGN KEY ("depositTypeId") REFERENCES "deposit_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "deposit_type_name" DROP CONSTRAINT "FK_099d5280064109969b7dcd6fc58"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deposit_type_name" ADD CONSTRAINT "FK_099d5280064109969b7dcd6fc58" FOREIGN KEY ("depositTypeId") REFERENCES "deposit_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedSubscriptionEntity1753290855868
  implements MigrationInterface
{
  name = 'RemovedSubscriptionEntity1753290855868';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_main" DROP CONSTRAINT "FK_e0a88c3760ab28caaacb20f71a7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e0a88c3760ab28caaacb20f71a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_main" DROP COLUMN "subscriptionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" ADD "deletedAt" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_master_level" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_main" ADD "subscriptionId" uuid`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e0a88c3760ab28caaacb20f71a" ON "service_main" ("subscriptionId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "service_main" ADD CONSTRAINT "FK_e0a88c3760ab28caaacb20f71a7" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}

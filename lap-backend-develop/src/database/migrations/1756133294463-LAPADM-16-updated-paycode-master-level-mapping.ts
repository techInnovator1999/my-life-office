import { MigrationInterface, QueryRunner } from 'typeorm';

export class LAPADM16UpdatedPaycodeMasterPaycodeMapping1756133294463
  implements MigrationInterface
{
  name = 'LAPADM16UpdatedPaycodeMasterPaycodeMapping1756133294463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "FK_6626c31216e0b068a55740e66bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "FK_a3cdf73b521b8205def9c625829"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "FK_f96cd26558e221eba2a8a4cdd70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP COLUMN "productCommissionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP COLUMN "carrierId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD "paycodeId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "UQ_9b202375c3afe3aae0fbbc6bb98" UNIQUE ("paycodeId")`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."paycode_type_enum" RENAME TO "paycode_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."paycode_type_enum" AS ENUM('vendor', 'loa')`,
    );
    await queryRunner.query(
      `ALTER TABLE "paycode" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "paycode" ALTER COLUMN "type" TYPE "public"."paycode_type_enum" USING "type"::"text"::"public"."paycode_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "paycode" ALTER COLUMN "type" SET DEFAULT 'vendor'`,
    );
    await queryRunner.query(`DROP TYPE "public"."paycode_type_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ALTER COLUMN "masterPaycodeId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "FK_f96cd26558e221eba2a8a4cdd70" FOREIGN KEY ("masterPaycodeId") REFERENCES "master_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "FK_9b202375c3afe3aae0fbbc6bb98" FOREIGN KEY ("paycodeId") REFERENCES "paycode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "FK_9b202375c3afe3aae0fbbc6bb98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "FK_f96cd26558e221eba2a8a4cdd70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ALTER COLUMN "masterPaycodeId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."paycode_type_enum_old" AS ENUM('DEFAULT', 'CUSTOM')`,
    );
    await queryRunner.query(
      `ALTER TABLE "paycode" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "paycode" ALTER COLUMN "type" TYPE "public"."paycode_type_enum_old" USING "type"::"text"::"public"."paycode_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "paycode" ALTER COLUMN "type" SET DEFAULT 'DEFAULT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."paycode_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."paycode_type_enum_old" RENAME TO "paycode_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP CONSTRAINT "UQ_9b202375c3afe3aae0fbbc6bb98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" DROP COLUMN "paycodeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD "carrierId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD "productCommissionId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "FK_f96cd26558e221eba2a8a4cdd70" FOREIGN KEY ("masterPaycodeId") REFERENCES "master_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "FK_a3cdf73b521b8205def9c625829" FOREIGN KEY ("carrierId") REFERENCES "carrier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier_agent_commission" ADD CONSTRAINT "FK_6626c31216e0b068a55740e66bf" FOREIGN KEY ("productCommissionId") REFERENCES "product_commission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCrmAgentField1768388038046 implements MigrationInterface {
    name = 'AddCrmAgentField1768388038046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_user_sponsoring_agent"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_term_license_value"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_term_license_isActive"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_region_value"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_region_code"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_region_isActive"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_product_sold_value"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_product_sold_isActive"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_license_type_value"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_license_type_isActive"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "crmAgent" boolean NOT NULL DEFAULT false`);
        
        // Update existing CRM agents (users with AGENT role and CRM-specific fields) to true
        await queryRunner.query(`
            UPDATE "user" 
            SET "crmAgent" = true 
            WHERE "roleId" = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' 
            AND (
                "primaryLicenseType" IS NOT NULL 
                OR "registrationType" IS NOT NULL 
                OR "mobile" IS NOT NULL
            )
        `);
        
        await queryRunner.query(`ALTER TABLE "term_license" ALTER COLUMN "order" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "order" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_sold" ALTER COLUMN "order" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "license_type" ALTER COLUMN "order" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_1f81de17b2284aeb90822c2666" ON "term_license" ("value") `);
        await queryRunner.query(`CREATE INDEX "IDX_2ca6f3ec907fe908e30f8c57db" ON "term_license" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_d87e21c5f9a2efdf23315555fd" ON "region" ("value") `);
        await queryRunner.query(`CREATE INDEX "IDX_74f7723fdff738f92929c0056c" ON "region" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_6bf94b3a2b8d46110155d9291e" ON "region" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_943ec0554cdb9acbbcee6b0fca" ON "product_sold" ("value") `);
        await queryRunner.query(`CREATE INDEX "IDX_c05efd5111ee5273b63095ea07" ON "product_sold" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_50a9b442d168ecb84f11737ab7" ON "license_type" ("value") `);
        await queryRunner.query(`CREATE INDEX "IDX_6dac38a22379cd7ce116c18e35" ON "license_type" ("isActive") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9c5f1321124f35ba086c4d29e4e" FOREIGN KEY ("sponsoringAgentId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9c5f1321124f35ba086c4d29e4e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6dac38a22379cd7ce116c18e35"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_50a9b442d168ecb84f11737ab7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c05efd5111ee5273b63095ea07"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_943ec0554cdb9acbbcee6b0fca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6bf94b3a2b8d46110155d9291e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74f7723fdff738f92929c0056c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d87e21c5f9a2efdf23315555fd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2ca6f3ec907fe908e30f8c57db"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f81de17b2284aeb90822c2666"`);
        await queryRunner.query(`ALTER TABLE "license_type" ALTER COLUMN "order" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_sold" ALTER COLUMN "order" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "region" ALTER COLUMN "order" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "term_license" ALTER COLUMN "order" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "crmAgent"`);
        await queryRunner.query(`CREATE INDEX "IDX_license_type_isActive" ON "license_type" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_license_type_value" ON "license_type" ("value") `);
        await queryRunner.query(`CREATE INDEX "IDX_product_sold_isActive" ON "product_sold" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_product_sold_value" ON "product_sold" ("value") `);
        await queryRunner.query(`CREATE INDEX "IDX_region_isActive" ON "region" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_region_code" ON "region" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_region_value" ON "region" ("value") `);
        await queryRunner.query(`CREATE INDEX "IDX_term_license_isActive" ON "term_license" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_term_license_value" ON "term_license" ("value") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_user_sponsoring_agent" FOREIGN KEY ("sponsoringAgentId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}

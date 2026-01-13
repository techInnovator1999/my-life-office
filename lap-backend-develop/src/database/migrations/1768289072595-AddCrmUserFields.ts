import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCrmUserFields1768289072595 implements MigrationInterface {
    name = 'AddCrmUserFields1768289072595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create registrationType enum
        await queryRunner.query(`CREATE TYPE "public"."user_registrationtype_enum" AS ENUM('INDIVIDUAL', 'BUSINESS', 'EMPLOYEE')`);
        
        // Add new columns to user table
        await queryRunner.query(`ALTER TABLE "user" ADD "mobile" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "registrationType" "public"."user_registrationtype_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "primaryLicenseType" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "residentState" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "licenseNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "yearsLicensed" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "priorProductsSold" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "currentCompany" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "googleAccessToken" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "googleRefreshToken" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "googleTokenExpiry" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastGoogleSyncAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "sponsoringAgentId" uuid`);
        
        // Add foreign key constraint for sponsoringAgentId with ON DELETE SET NULL
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_user_sponsoring_agent" FOREIGN KEY ("sponsoringAgentId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        
        // Create Agent role if it doesn't exist
        const agentRoleExists = await queryRunner.query(`
            SELECT id FROM "role" WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        `);
        if (agentRoleExists.length === 0) {
            await queryRunner.query(`
                INSERT INTO "role" ("id", "name") 
                VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Agent')
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_user_sponsoring_agent"`);
        
        // Drop columns
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "sponsoringAgentId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastGoogleSyncAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleTokenExpiry"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleRefreshToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleAccessToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "currentCompany"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "priorProductsSold"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "yearsLicensed"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "licenseNumber"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "residentState"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "primaryLicenseType"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "registrationType"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mobile"`);
        
        // Drop enum
        await queryRunner.query(`DROP TYPE "public"."user_registrationtype_enum"`);
    }

}

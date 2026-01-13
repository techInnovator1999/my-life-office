import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContactFields1767965246748 implements MigrationInterface {
    name = 'AddContactFields1767965246748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" ADD "workPhone" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "occupation" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "employer" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "spouse" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "ssn" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "mbiNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "companyName" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "industryType" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "ownerName" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "ownerTitle" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "ownerEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "ownerPhone" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "otherName" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "otherTitle" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "otherEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "otherPhone" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "parentCompany" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "notes" text`);
        await queryRunner.query(`ALTER TYPE "public"."contact_contacttype_enum" RENAME TO "contact_contacttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."contact_contacttype_enum" AS ENUM('INDIVIDUAL', 'BUSINESS', 'EMPLOYEE')`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "contactType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "contactType" TYPE "public"."contact_contacttype_enum" USING "contactType"::"text"::"public"."contact_contacttype_enum"`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "contactType" SET DEFAULT 'INDIVIDUAL'`);
        await queryRunner.query(`DROP TYPE "public"."contact_contacttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "firstName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "lastName" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "lastName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "firstName" SET NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."contact_contacttype_enum_old" AS ENUM('INDIVIDUAL', 'BUSINESS')`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "contactType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "contactType" TYPE "public"."contact_contacttype_enum_old" USING "contactType"::"text"::"public"."contact_contacttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "contactType" SET DEFAULT 'INDIVIDUAL'`);
        await queryRunner.query(`DROP TYPE "public"."contact_contacttype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."contact_contacttype_enum_old" RENAME TO "contact_contacttype_enum"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "parentCompany"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "otherPhone"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "otherEmail"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "otherTitle"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "otherName"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "ownerPhone"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "ownerEmail"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "ownerTitle"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "ownerName"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "industryType"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "companyName"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "mbiNumber"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "ssn"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "spouse"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "employer"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "occupation"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "workPhone"`);
    }

}

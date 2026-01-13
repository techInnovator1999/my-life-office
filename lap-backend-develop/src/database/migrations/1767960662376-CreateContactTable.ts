import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateContactTable1767960662376 implements MigrationInterface {
    name = 'CreateContactTable1767960662376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contact_contacttype_enum" AS ENUM('INDIVIDUAL', 'BUSINESS')`);
        await queryRunner.query(`CREATE TYPE "public"."contact_status_enum" AS ENUM('PROSPECT', 'CLIENT', 'LOST')`);
        await queryRunner.query(`CREATE TABLE "contact" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contactType" "public"."contact_contacttype_enum" NOT NULL DEFAULT 'INDIVIDUAL', "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phoneNumber" character varying, "dateOfBirth" TIMESTAMP, "primaryAddress" character varying, "city" character varying, "state" character varying, "zipCode" character varying, "source" character varying, "referredBy" character varying, "status" "public"."contact_status_enum" NOT NULL DEFAULT 'PROSPECT', "isLocked" boolean NOT NULL DEFAULT false, "lockedAt" TIMESTAMP, "lockedBy" character varying, "isFromGoogle" boolean NOT NULL DEFAULT false, "googleContactId" character varying, "googleTags" text DEFAULT '', "lastSyncedAt" TIMESTAMP, "agentId" uuid NOT NULL, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f49c67526d288b38624a3f822f" ON "contact" ("contactType") `);
        await queryRunner.query(`CREATE INDEX "IDX_eff09bb429f175523787f46003" ON "contact" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_812d7f204b05c4b45db02dcba1" ON "contact" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_369af1cd94b23fc8c11bc97d96" ON "contact" ("isLocked") `);
        await queryRunner.query(`CREATE INDEX "IDX_3819f07aecc5593c450b599138" ON "contact" ("isFromGoogle") `);
        await queryRunner.query(`CREATE INDEX "IDX_9cd692d9ea0d4b400bbe61393c" ON "contact" ("googleContactId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f1e3f1d283ecc68c5d18c5f97f" ON "contact" ("agentId") `);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_f1e3f1d283ecc68c5d18c5f97f9" FOREIGN KEY ("agentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_f1e3f1d283ecc68c5d18c5f97f9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f1e3f1d283ecc68c5d18c5f97f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9cd692d9ea0d4b400bbe61393c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3819f07aecc5593c450b599138"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_369af1cd94b23fc8c11bc97d96"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_812d7f204b05c4b45db02dcba1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eff09bb429f175523787f46003"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f49c67526d288b38624a3f822f"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TYPE "public"."contact_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."contact_contacttype_enum"`);
    }

}

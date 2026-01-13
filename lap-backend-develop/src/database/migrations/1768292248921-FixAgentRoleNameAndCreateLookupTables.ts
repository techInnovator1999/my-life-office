import { MigrationInterface, QueryRunner } from "typeorm";

export class FixAgentRoleNameAndCreateLookupTables1768292248921 implements MigrationInterface {
    name = 'FixAgentRoleNameAndCreateLookupTables1768292248921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Fix AGENT role name to Agent (title case)
        await queryRunner.query(`
            UPDATE "role" 
            SET "name" = 'Agent' 
            WHERE "id" = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' AND "name" = 'AGENT'
        `);

        // Create license_type lookup table
        await queryRunner.query(`
            CREATE TABLE "license_type" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "label" character varying NOT NULL,
                "value" character varying NOT NULL,
                "order" integer DEFAULT 0,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "PK_license_type" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_license_type_value" UNIQUE ("value")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_license_type_value" ON "license_type" ("value")`);
        await queryRunner.query(`CREATE INDEX "IDX_license_type_isActive" ON "license_type" ("isActive")`);

        // Create region (state) lookup table
        await queryRunner.query(`
            CREATE TABLE "region" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "label" character varying NOT NULL,
                "value" character varying NOT NULL,
                "code" character varying(2),
                "order" integer DEFAULT 0,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "PK_region" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_region_value" UNIQUE ("value")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_region_value" ON "region" ("value")`);
        await queryRunner.query(`CREATE INDEX "IDX_region_code" ON "region" ("code")`);
        await queryRunner.query(`CREATE INDEX "IDX_region_isActive" ON "region" ("isActive")`);

        // Create term_license lookup table
        await queryRunner.query(`
            CREATE TABLE "term_license" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "label" character varying NOT NULL,
                "value" character varying NOT NULL,
                "order" integer DEFAULT 0,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "PK_term_license" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_term_license_value" UNIQUE ("value")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_term_license_value" ON "term_license" ("value")`);
        await queryRunner.query(`CREATE INDEX "IDX_term_license_isActive" ON "term_license" ("isActive")`);

        // Create product_sold lookup table
        await queryRunner.query(`
            CREATE TABLE "product_sold" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "label" character varying NOT NULL,
                "value" character varying NOT NULL,
                "order" integer DEFAULT 0,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "PK_product_sold" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_product_sold_value" UNIQUE ("value")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_product_sold_value" ON "product_sold" ("value")`);
        await queryRunner.query(`CREATE INDEX "IDX_product_sold_isActive" ON "product_sold" ("isActive")`);

        // Insert LicenseType data
        await queryRunner.query(`
            INSERT INTO "license_type" ("label", "value", "order") VALUES
            ('Life and Health License (52 hr)', 'Life and Health License (52 hr)', 1),
            ('Life-Only License (32 hr)', 'Life-Only License (32 hr)', 2),
            ('Health-Only License (32 hr)', 'Health-Only License (32 hr)', 3),
            ('Securities License', 'Securities License', 4),
            ('Not currently licensed', 'Not currently licensed', 5)
        `);

        // Insert Region (State) data
        await queryRunner.query(`
            INSERT INTO "region" ("label", "value", "code", "order") VALUES
            ('California', 'California', 'CA', 1),
            ('Alabama', 'Alabama', 'AL', 2),
            ('Alaska', 'Alaska', 'AK', 3),
            ('Arizona', 'Arizona', 'AZ', 4),
            ('Arkansas', 'Arkansas', 'AR', 5),
            ('Colorado', 'Colorado', 'CO', 6),
            ('Connecticut', 'Connecticut', 'CT', 7),
            ('Delaware', 'Delaware', 'DE', 8),
            ('Florida', 'Florida', 'FL', 9),
            ('Georgia', 'Georgia', 'GA', 10),
            ('Hawaii', 'Hawaii', 'HI', 11),
            ('Idaho', 'Idaho', 'ID', 12),
            ('Illinois', 'Illinois', 'IL', 13),
            ('Indiana', 'Indiana', 'IN', 14),
            ('Iowa', 'Iowa', 'IA', 15),
            ('Kansas', 'Kansas', 'KS', 16),
            ('Kentucky', 'Kentucky', 'KY', 17),
            ('Louisiana', 'Louisiana', 'LA', 18),
            ('Maine', 'Maine', 'ME', 19),
            ('Maryland', 'Maryland', 'MD', 20),
            ('Massachusetts', 'Massachusetts', 'MA', 21),
            ('Michigan', 'Michigan', 'MI', 22),
            ('Minnesota', 'Minnesota', 'MN', 23),
            ('Mississippi', 'Mississippi', 'MS', 24),
            ('Missouri', 'Missouri', 'MO', 25),
            ('Montana', 'Montana', 'MT', 26),
            ('Nebraska', 'Nebraska', 'NE', 27),
            ('Nevada', 'Nevada', 'NV', 28),
            ('New Hampshire', 'New Hampshire', 'NH', 29),
            ('New Jersey', 'New Jersey', 'NJ', 30),
            ('New Mexico', 'New Mexico', 'NM', 31),
            ('New York', 'New York', 'NY', 32),
            ('North Carolina', 'North Carolina', 'NC', 33),
            ('North Dakota', 'North Dakota', 'ND', 34),
            ('Ohio', 'Ohio', 'OH', 35),
            ('Oklahoma', 'Oklahoma', 'OK', 36),
            ('Oregon', 'Oregon', 'OR', 37),
            ('Pennsylvania', 'Pennsylvania', 'PA', 38),
            ('Rhode Island', 'Rhode Island', 'RI', 39),
            ('South Carolina', 'South Carolina', 'SC', 40),
            ('South Dakota', 'South Dakota', 'SD', 41),
            ('Tennessee', 'Tennessee', 'TN', 42),
            ('Texas', 'Texas', 'TX', 43),
            ('Utah', 'Utah', 'UT', 44),
            ('Vermont', 'Vermont', 'VT', 45),
            ('Virginia', 'Virginia', 'VA', 46),
            ('Washington', 'Washington', 'WA', 47),
            ('West Virginia', 'West Virginia', 'WV', 48),
            ('Wisconsin', 'Wisconsin', 'WI', 49),
            ('Wyoming', 'Wyoming', 'WY', 50)
        `);

        // Insert TermLicense data
        await queryRunner.query(`
            INSERT INTO "term_license" ("label", "value", "order") VALUES
            ('0-1 year', '0-1 year', 1),
            ('2-5 Years', '2-5 Years', 2),
            ('6-10 years', '6-10 years', 3),
            ('11+ years', '11+ years', 4)
        `);

        // Insert ProductSold data
        await queryRunner.query(`
            INSERT INTO "product_sold" ("label", "value", "order") VALUES
            ('None', 'None', 1),
            ('Annuities', 'Annuities', 2),
            ('Life Insurance', 'Life Insurance', 3),
            ('Health Insurance', 'Health Insurance', 4),
            ('Medicare', 'Medicare', 5),
            ('Long Term Care/Disability', 'Long Term Care/Disability', 6),
            ('Asset Management', 'Asset Management', 7)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop lookup tables
        await queryRunner.query(`DROP TABLE IF EXISTS "product_sold"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "term_license"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "region"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "license_type"`);

        // Revert role name back to AGENT
        await queryRunner.query(`
            UPDATE "role" 
            SET "name" = 'AGENT' 
            WHERE "id" = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' AND "name" = 'Agent'
        `);
    }

}

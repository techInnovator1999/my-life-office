import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1753180152242 implements MigrationInterface {
  name = 'InitialMigration1753180152242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "stripe_webhook_entity" ("id" SERIAL NOT NULL, "payload" json NOT NULL, "type" character varying NOT NULL, "isDequeued" boolean NOT NULL, "isSuccess" boolean NOT NULL, "exception" character varying, CONSTRAINT "PK_4d0f14bcb0ab35c2e9554138938" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stripe_charge_entity" ("id" SERIAL NOT NULL, "chargeId" character varying NOT NULL, "status" character varying NOT NULL, "amountCaptured" numeric(10,2) NOT NULL, "description" character varying NOT NULL, "customer" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7dc144d10e3a1eeaa2290c37f62" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "price" numeric NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email-template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "subject" character varying NOT NULL, "name" character varying NOT NULL, "json" json NOT NULL, "html" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_0e1845aa023e6f6a34686cba2ef" UNIQUE ("name", "deletedAt"), CONSTRAINT "PK_85f62c144b7cc9f777168bf0093" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "stack" text, "error" text, "context" json, "subject" character varying(255), "subjectTemplate" character varying(255), "body" text, "bodyTemplate" text, "text" character varying(255), "to" text, "from" json, "cc" character varying(255), "sentAt" TIMESTAMP, "failedAt" TIMESTAMP, CONSTRAINT "PK_1e7ed8734ee054ef18002e29b1c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email_attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "emailId" uuid, "fileId" uuid, CONSTRAINT "PK_ec4666b1b4877d62c513a2d837a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user-device" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deviceId" character varying NOT NULL, "fcmToken" character varying NOT NULL, "language" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_6ee9f06a7e2ece333cceb23fe65" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user-preference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isPushNotificationEnabled" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_2a44796cd34b7759c34fb3f711e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "account-manager" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "access_config" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "REL_2a4479edcc9051b0c60529aa06" UNIQUE ("userId"), CONSTRAINT "PK_45cad8c51a508ee973e2b7e2249" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user-suspension" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, "reason" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_58cbfcbba152f4361ab8d0b5cc5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "socialId" character varying, "firstName" character varying, "lastName" character varying, "metaData" character varying, "reference_code" character varying, "defaultPromoCode" character varying, "lastLogin" TIMESTAMP, "rejectedAt" TIMESTAMP, "approvedAt" TIMESTAMP, "waitingApprovalAt" TIMESTAMP, "archivedAt" TIMESTAMP, "isShowToolTip" boolean DEFAULT false, "isApproved" boolean NOT NULL DEFAULT false, "accountManagerStatus" character varying, "verificationCode" character varying, "verificationExpires" TIMESTAMP, "heardBy" character varying, "referralName" character varying, "deactivatedAt" TIMESTAMP, "deactivatedReason" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "photoId" uuid, "roleId" uuid, "statusId" uuid, CONSTRAINT "UQ_3be9f7978916158ca4f0d904849" UNIQUE ("roleId", "email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE TABLE "account_notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isRead" boolean NOT NULL, "title_key" character varying NOT NULL, "body_key" character varying NOT NULL, "entityId" character varying, "type" integer NOT NULL, "data" character varying NOT NULL, "placeHolderData" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_2e494e8baf5d322e4c57b251eea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_commission" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "commission" double precision NOT NULL DEFAULT '0', "productId" uuid, "paycodeId" uuid, CONSTRAINT "PK_700058e86f1830121eb4253a347" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_79d03521b97d9f91574cdd4581" ON "product_commission" ("productId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "paycode" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "carrierId" uuid NOT NULL, CONSTRAINT "PK_37d963f4cb55c1417a70c0e0aa3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5c1c3fbd016a02eaf4c38b9e90" ON "paycode" ("carrierId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "broker_staff" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "phone" character varying NOT NULL, "title" character varying NOT NULL, "email" character varying NOT NULL, "brokerId" uuid NOT NULL, CONSTRAINT "PK_ad3887e7a8a43111b87beec95b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f8ecfb6314015acbb4c03491b0" ON "broker_staff" ("brokerId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "broker" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "brokerType" character varying NOT NULL, "website" character varying, "address" character varying, "contracting" character varying, "mainContact" character varying, "phoneNumber" character varying, "notes" character varying, CONSTRAINT "PK_06617ad8cb3dc7339492a5c995d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."carrier_level_enum" AS ENUM('Level 1', 'Level 2', 'Level 3', 'TBD')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."carrier_rating_enum" AS ENUM('1', '2', '3', '4', '5')`,
    );
    await queryRunner.query(
      `CREATE TABLE "carrier" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "city" character varying, "state" character varying, "zip" character varying, "serviceId" character varying NOT NULL, "fullName" character varying, "shortName" character varying NOT NULL, "initial" character varying, "logo" character varying, "mainAddress" character varying NOT NULL, "mainPhone" character varying, "agentSupportPhone" character varying, "publicUrl" character varying, "agentUrl" character varying, "contactNotes" character varying, "emailCommission" character varying, "emailNewBusiness" character varying, "adminCutoff" character varying, "adminReleaseDate" character varying, "adminMinck" character varying, "adminMineft" character varying, "adminCommissionPolicy" character varying, "adminChargebackSchedule" character varying, "adminAdvanceCap" character varying, "adminCommContact" character varying, "adminOtherNotes" character varying, "level" "public"."carrier_level_enum" NOT NULL, "rating" "public"."carrier_rating_enum" NOT NULL, "serviceMainId" uuid NOT NULL, "brokerId" uuid NOT NULL, CONSTRAINT "PK_f615ebd1906f0270d41b3a5a8b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d2d7db36fcf623c14ddc6596ec" ON "carrier" ("serviceMainId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ff7fa0efe18ed20d4cf3d0087a" ON "carrier" ("brokerId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "deposit_type" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "names" text array NOT NULL, "serviceMainId" uuid NOT NULL, CONSTRAINT "PK_c88efc55015e90abd20280233f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1091935656e72f4415957bcccc" ON "deposit_type" ("serviceMainId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "stateAvailable" character varying, "subName" character varying, "productFullName" character varying, "criteria" character varying, "notes" character varying, "lengths" text array NOT NULL, "serviceMainType" character varying NOT NULL, "productReal" character varying NOT NULL DEFAULT 'TBD', "tier" character varying NOT NULL DEFAULT 'TBD', "rating" integer NOT NULL DEFAULT '1', "orderNo" SERIAL NOT NULL, "carrierId" uuid NOT NULL, "serviceSubTypeId" uuid NOT NULL, "depositTypeId" uuid NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_07fab8dacb92bd61124fb824b4" ON "product" ("carrierId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "service_sub_type" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "serviceMainId" uuid NOT NULL, CONSTRAINT "PK_8a7246d43b2132f452bf7617884" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7db73cf3c2a43f0d4e433f131a" ON "service_sub_type" ("serviceMainId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "service_main" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "shortName" character varying, "description" character varying, "subscriptionId" uuid, CONSTRAINT "PK_cafbc0d1ea02c3888012c98169a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bdb934c5074ebcf7efd143282c" ON "service_main" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e0a88c3760ab28caaacb20f71a" ON "service_main" ("subscriptionId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "subscription" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "master_level" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "serial" SERIAL NOT NULL, CONSTRAINT "UQ_c7b54a9bcd142e9f74d464b0a31" UNIQUE ("serial"), CONSTRAINT "PK_321ba5a00c7be5a1f519eeb7774" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" text NOT NULL, "message" text NOT NULL, "stack" text NOT NULL, "method" text NOT NULL, "payload" text, "status" integer NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_a76c5cd486f7779bd9c319afd27" UNIQUE ("name"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company_master_level" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying, "companyId" uuid, "masterPaycodeId" uuid, CONSTRAINT "UQ_82de488539f9c2281ef3fe98fe6" UNIQUE ("companyId", "masterPaycodeId"), CONSTRAINT "PK_eb578916a288c2c5413b7e5ef6d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "deposit_type_name" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_c51579fe5a50f3a98717c56d296" UNIQUE ("name"), CONSTRAINT "PK_6bcc184698a40084d96bb2684f8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_attachment" ADD CONSTRAINT "FK_1db5717db8d956cd79992b22654" FOREIGN KEY ("emailId") REFERENCES "email"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_attachment" ADD CONSTRAINT "FK_f5c7c087574c426ac2c9b6009af" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-device" ADD CONSTRAINT "FK_72174b01403a7fd814fb894aecc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-preference" ADD CONSTRAINT "FK_9bb77797d2f34f489301fc69898" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account-manager" ADD CONSTRAINT "FK_2a4479edcc9051b0c60529aa066" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-suspension" ADD CONSTRAINT "FK_b69cab85dcf203dd9abd4e57f35" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_notification" ADD CONSTRAINT "FK_23ec9a49e25917815948a42b4c6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_commission" ADD CONSTRAINT "FK_79d03521b97d9f91574cdd45818" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_commission" ADD CONSTRAINT "FK_c0bfd01e7d9a854fb29988d98bc" FOREIGN KEY ("paycodeId") REFERENCES "paycode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "paycode" ADD CONSTRAINT "FK_5c1c3fbd016a02eaf4c38b9e907" FOREIGN KEY ("carrierId") REFERENCES "carrier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "broker_staff" ADD CONSTRAINT "FK_f8ecfb6314015acbb4c03491b00" FOREIGN KEY ("brokerId") REFERENCES "broker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier" ADD CONSTRAINT "FK_d2d7db36fcf623c14ddc6596ec1" FOREIGN KEY ("serviceMainId") REFERENCES "service_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier" ADD CONSTRAINT "FK_ff7fa0efe18ed20d4cf3d0087a4" FOREIGN KEY ("brokerId") REFERENCES "broker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deposit_type" ADD CONSTRAINT "FK_1091935656e72f4415957bcccc5" FOREIGN KEY ("serviceMainId") REFERENCES "service_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_07fab8dacb92bd61124fb824b49" FOREIGN KEY ("carrierId") REFERENCES "carrier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_5cd420383f4877b22c5d646704f" FOREIGN KEY ("serviceSubTypeId") REFERENCES "service_sub_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_61ce1aa61d3b39dc695b876530a" FOREIGN KEY ("depositTypeId") REFERENCES "deposit_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_sub_type" ADD CONSTRAINT "FK_7db73cf3c2a43f0d4e433f131a8" FOREIGN KEY ("serviceMainId") REFERENCES "service_main"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_main" ADD CONSTRAINT "FK_e0a88c3760ab28caaacb20f71a7" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" ADD CONSTRAINT "FK_b28241011506bd7f69bc7bdfa70" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" ADD CONSTRAINT "FK_82b9305e5b5760683eb0cedecd6" FOREIGN KEY ("masterPaycodeId") REFERENCES "master_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_master_level" DROP CONSTRAINT "FK_82b9305e5b5760683eb0cedecd6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_master_level" DROP CONSTRAINT "FK_b28241011506bd7f69bc7bdfa70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_main" DROP CONSTRAINT "FK_e0a88c3760ab28caaacb20f71a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_sub_type" DROP CONSTRAINT "FK_7db73cf3c2a43f0d4e433f131a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_61ce1aa61d3b39dc695b876530a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_5cd420383f4877b22c5d646704f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_07fab8dacb92bd61124fb824b49"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deposit_type" DROP CONSTRAINT "FK_1091935656e72f4415957bcccc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier" DROP CONSTRAINT "FK_ff7fa0efe18ed20d4cf3d0087a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "carrier" DROP CONSTRAINT "FK_d2d7db36fcf623c14ddc6596ec1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "broker_staff" DROP CONSTRAINT "FK_f8ecfb6314015acbb4c03491b00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "paycode" DROP CONSTRAINT "FK_5c1c3fbd016a02eaf4c38b9e907"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_commission" DROP CONSTRAINT "FK_c0bfd01e7d9a854fb29988d98bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_commission" DROP CONSTRAINT "FK_79d03521b97d9f91574cdd45818"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_notification" DROP CONSTRAINT "FK_23ec9a49e25917815948a42b4c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-suspension" DROP CONSTRAINT "FK_b69cab85dcf203dd9abd4e57f35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account-manager" DROP CONSTRAINT "FK_2a4479edcc9051b0c60529aa066"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-preference" DROP CONSTRAINT "FK_9bb77797d2f34f489301fc69898"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-device" DROP CONSTRAINT "FK_72174b01403a7fd814fb894aecc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_attachment" DROP CONSTRAINT "FK_f5c7c087574c426ac2c9b6009af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_attachment" DROP CONSTRAINT "FK_1db5717db8d956cd79992b22654"`,
    );
    await queryRunner.query(`DROP TABLE "deposit_type_name"`);
    await queryRunner.query(`DROP TABLE "company_master_level"`);
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP TABLE "logs"`);
    await queryRunner.query(`DROP TABLE "master_level"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "subscription"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e0a88c3760ab28caaacb20f71a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bdb934c5074ebcf7efd143282c"`,
    );
    await queryRunner.query(`DROP TABLE "service_main"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7db73cf3c2a43f0d4e433f131a"`,
    );
    await queryRunner.query(`DROP TABLE "service_sub_type"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_07fab8dacb92bd61124fb824b4"`,
    );
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1091935656e72f4415957bcccc"`,
    );
    await queryRunner.query(`DROP TABLE "deposit_type"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ff7fa0efe18ed20d4cf3d0087a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d2d7db36fcf623c14ddc6596ec"`,
    );
    await queryRunner.query(`DROP TABLE "carrier"`);
    await queryRunner.query(`DROP TYPE "public"."carrier_rating_enum"`);
    await queryRunner.query(`DROP TYPE "public"."carrier_level_enum"`);
    await queryRunner.query(`DROP TABLE "broker"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f8ecfb6314015acbb4c03491b0"`,
    );
    await queryRunner.query(`DROP TABLE "broker_staff"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5c1c3fbd016a02eaf4c38b9e90"`,
    );
    await queryRunner.query(`DROP TABLE "paycode"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_79d03521b97d9f91574cdd4581"`,
    );
    await queryRunner.query(`DROP TABLE "product_commission"`);
    await queryRunner.query(`DROP TABLE "account_notification"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "user-suspension"`);
    await queryRunner.query(`DROP TABLE "account-manager"`);
    await queryRunner.query(`DROP TABLE "user-preference"`);
    await queryRunner.query(`DROP TABLE "user-device"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "email_attachment"`);
    await queryRunner.query(`DROP TABLE "email"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "email-template"`);
    await queryRunner.query(`DROP TABLE "plans"`);
    await queryRunner.query(`DROP TABLE "stripe_charge_entity"`);
    await queryRunner.query(`DROP TABLE "stripe_webhook_entity"`);
  }
}

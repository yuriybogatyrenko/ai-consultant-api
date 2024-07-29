import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1722183797691 implements MigrationInterface {
    name = 'Init1722183797691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."account_team_member_role_enum" AS ENUM('admin', 'member')`);
        await queryRunner.query(`CREATE TABLE "account_team_member" ("member_id" SERIAL NOT NULL, "role" "public"."account_team_member_role_enum" NOT NULL, "permissions" json NOT NULL, "joined_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "account_id" uuid, "user_id" uuid, CONSTRAINT "PK_2179a10cfb28d741855da3deceb" PRIMARY KEY ("member_id"))`);
        await queryRunner.query(`CREATE TABLE "api_key_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "accountAccountId" uuid, CONSTRAINT "UQ_c5f6e7e726a6d74c77fde1fdddb" UNIQUE ("key"), CONSTRAINT "PK_4c0ab209778e65782d430d7ee69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan" ("plan_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" integer NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cf8cdd9ac9fbd4f9dd000bb62ca" PRIMARY KEY ("plan_id"))`);
        await queryRunner.query(`CREATE TABLE "subscription" ("subscription_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "account_id" uuid, "plan_id" uuid, CONSTRAINT "PK_05fb2b68e4d0d5deb240c7f4105" PRIMARY KEY ("subscription_id"))`);
        await queryRunner.query(`CREATE TABLE "payment" ("payment_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "currency" character varying NOT NULL, "payment_method" character varying NOT NULL, "payment_status" character varying NOT NULL, "transaction_id" character varying NOT NULL, "payment_date" TIMESTAMP NOT NULL DEFAULT now(), "account_id" uuid, "subscription_id" uuid, CONSTRAINT "PK_9fff60ac6ac1844ea4e0cfba67a" PRIMARY KEY ("payment_id"))`);
        await queryRunner.query(`CREATE TABLE "contact_thread" ("thread_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "contactContactId" uuid, CONSTRAINT "PK_f7a68779bf866d1f37c4858f200" PRIMARY KEY ("thread_id"))`);
        await queryRunner.query(`CREATE TABLE "contact_message" ("message_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "platform" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "threadThreadId" uuid, "contactContactId" uuid, CONSTRAINT "PK_459d31fe452d1adb97cb3bf2b61" PRIMARY KEY ("message_id"))`);
        await queryRunner.query(`CREATE TABLE "contact" ("contact_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "platform" character varying NOT NULL, "platform_user_id" character varying NOT NULL, "accountAccountId" uuid, CONSTRAINT "PK_b77c91f220387c3c90df787bce5" PRIMARY KEY ("contact_id"))`);
        await queryRunner.query(`CREATE TABLE "platform_instagram_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "access_token" character varying NOT NULL, "instagram_user_id" character varying NOT NULL, "instagram_username" character varying NOT NULL, "token_type" character varying NOT NULL, "expires_in" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "connected_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "accountAccountId" uuid, CONSTRAINT "REL_8af95724823769a4a091962358" UNIQUE ("accountAccountId"), CONSTRAINT "PK_ec15cb67002fe69cac2e1b047a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "platform_telegram_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "access_token" character varying NOT NULL, "bot_username" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "connected_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "accountAccountId" uuid, CONSTRAINT "REL_a7d52d43f8faf9edac5594bc24" UNIQUE ("accountAccountId"), CONSTRAINT "PK_3688b4166af32a716129576c8cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "platform_whats_app_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "access_token" character varying NOT NULL, "phone_number_id" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "connected_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_919942f9879840ebf686add1dec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("account_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_ea08b54a9d7322975ffc57fc612" PRIMARY KEY ("account_id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity_roles_role" ("userEntityId" uuid NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_1eb0c4d879c2e0866b09ed0c3ee" PRIMARY KEY ("userEntityId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1d7a446141f20f93dde65cd390" ON "user_entity_roles_role" ("userEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c99d2cee7f2dbae3311fa0d7dc" ON "user_entity_roles_role" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "role_permissions_permission" ("roleId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_b817d7eca3b85f22130861259dd" PRIMARY KEY ("roleId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b36cb2e04bc353ca4ede00d87b" ON "role_permissions_permission" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bfbc9e263d4cea6d7a8c9eb3ad" ON "role_permissions_permission" ("permissionId") `);
        await queryRunner.query(`ALTER TABLE "account_team_member" ADD CONSTRAINT "FK_ddf766233a079f160970279e494" FOREIGN KEY ("account_id") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_team_member" ADD CONSTRAINT "FK_61bcbb1b8b71af3156f0b0e3f39" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api_key_entity" ADD CONSTRAINT "FK_e8c21e7d1f5fd4bdc6a9f4be450" FOREIGN KEY ("accountAccountId") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_587985961c9f142c76f623e5e40" FOREIGN KEY ("account_id") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_5fde988e5d9b9a522d70ebec27c" FOREIGN KEY ("plan_id") REFERENCES "plan"("plan_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_bb95477ae48c741a9c1445babfd" FOREIGN KEY ("account_id") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_c3d0d14588512c4eb2d86b4b954" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("subscription_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_thread" ADD CONSTRAINT "FK_bd1c8052e8a4b2d105b388f5798" FOREIGN KEY ("contactContactId") REFERENCES "contact"("contact_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD CONSTRAINT "FK_d708eb599e8be515176138deec3" FOREIGN KEY ("threadThreadId") REFERENCES "contact_thread"("thread_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD CONSTRAINT "FK_2cc0552d2f95145197070e837c0" FOREIGN KEY ("contactContactId") REFERENCES "contact"("contact_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_ccc6a399f0b1bc38663b215f373" FOREIGN KEY ("accountAccountId") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "platform_instagram_setting" ADD CONSTRAINT "FK_8af95724823769a4a091962358a" FOREIGN KEY ("accountAccountId") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "platform_telegram_setting" ADD CONSTRAINT "FK_a7d52d43f8faf9edac5594bc24a" FOREIGN KEY ("accountAccountId") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_72719f338bfbe9aa98f4439d2b4" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity_roles_role" ADD CONSTRAINT "FK_1d7a446141f20f93dde65cd3908" FOREIGN KEY ("userEntityId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_entity_roles_role" ADD CONSTRAINT "FK_c99d2cee7f2dbae3311fa0d7dca" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_b36cb2e04bc353ca4ede00d87b9" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_bfbc9e263d4cea6d7a8c9eb3ad2" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_bfbc9e263d4cea6d7a8c9eb3ad2"`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_b36cb2e04bc353ca4ede00d87b9"`);
        await queryRunner.query(`ALTER TABLE "user_entity_roles_role" DROP CONSTRAINT "FK_c99d2cee7f2dbae3311fa0d7dca"`);
        await queryRunner.query(`ALTER TABLE "user_entity_roles_role" DROP CONSTRAINT "FK_1d7a446141f20f93dde65cd3908"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_72719f338bfbe9aa98f4439d2b4"`);
        await queryRunner.query(`ALTER TABLE "platform_telegram_setting" DROP CONSTRAINT "FK_a7d52d43f8faf9edac5594bc24a"`);
        await queryRunner.query(`ALTER TABLE "platform_instagram_setting" DROP CONSTRAINT "FK_8af95724823769a4a091962358a"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_ccc6a399f0b1bc38663b215f373"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP CONSTRAINT "FK_2cc0552d2f95145197070e837c0"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP CONSTRAINT "FK_d708eb599e8be515176138deec3"`);
        await queryRunner.query(`ALTER TABLE "contact_thread" DROP CONSTRAINT "FK_bd1c8052e8a4b2d105b388f5798"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_c3d0d14588512c4eb2d86b4b954"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_bb95477ae48c741a9c1445babfd"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_5fde988e5d9b9a522d70ebec27c"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_587985961c9f142c76f623e5e40"`);
        await queryRunner.query(`ALTER TABLE "api_key_entity" DROP CONSTRAINT "FK_e8c21e7d1f5fd4bdc6a9f4be450"`);
        await queryRunner.query(`ALTER TABLE "account_team_member" DROP CONSTRAINT "FK_61bcbb1b8b71af3156f0b0e3f39"`);
        await queryRunner.query(`ALTER TABLE "account_team_member" DROP CONSTRAINT "FK_ddf766233a079f160970279e494"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bfbc9e263d4cea6d7a8c9eb3ad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b36cb2e04bc353ca4ede00d87b"`);
        await queryRunner.query(`DROP TABLE "role_permissions_permission"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c99d2cee7f2dbae3311fa0d7dc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d7a446141f20f93dde65cd390"`);
        await queryRunner.query(`DROP TABLE "user_entity_roles_role"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "platform_whats_app_setting"`);
        await queryRunner.query(`DROP TABLE "platform_telegram_setting"`);
        await queryRunner.query(`DROP TABLE "platform_instagram_setting"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TABLE "contact_message"`);
        await queryRunner.query(`DROP TABLE "contact_thread"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TABLE "plan"`);
        await queryRunner.query(`DROP TABLE "api_key_entity"`);
        await queryRunner.query(`DROP TABLE "account_team_member"`);
        await queryRunner.query(`DROP TYPE "public"."account_team_member_role_enum"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomFieldsAdded1722532899556 implements MigrationInterface {
    name = 'CustomFieldsAdded1722532899556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."account_custom_field_type_enum" AS ENUM('text', 'number', 'date', 'boolean')`);
        await queryRunner.query(`CREATE TABLE "account_custom_field" ("custom_field_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "field_name" character varying NOT NULL, "field_value" character varying NOT NULL, "type" "public"."account_custom_field_type_enum" NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "account_id" uuid, CONSTRAINT "PK_5412b7246db75412ec5e09c7756" PRIMARY KEY ("custom_field_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."contact_custom_field_type_enum" AS ENUM('text', 'number', 'date', 'boolean')`);
        await queryRunner.query(`CREATE TABLE "contact_custom_field" ("custom_field_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "field_name" character varying NOT NULL, "field_value" character varying NOT NULL, "type" "public"."contact_custom_field_type_enum" NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "contact_id" uuid, CONSTRAINT "PK_2cefc971c624bae336325a753e9" PRIMARY KEY ("custom_field_id"))`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "account_custom_field" ADD CONSTRAINT "FK_bb2aa5c50fab7e167edfc655996" FOREIGN KEY ("account_id") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" ADD CONSTRAINT "FK_7bb4b57ca338362ca0bb5ce08f3" FOREIGN KEY ("contact_id") REFERENCES "contact"("contact_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_custom_field" DROP CONSTRAINT "FK_7bb4b57ca338362ca0bb5ce08f3"`);
        await queryRunner.query(`ALTER TABLE "account_custom_field" DROP CONSTRAINT "FK_bb2aa5c50fab7e167edfc655996"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "created_at"`);
        await queryRunner.query(`DROP TABLE "contact_custom_field"`);
        await queryRunner.query(`DROP TYPE "public"."contact_custom_field_type_enum"`);
        await queryRunner.query(`DROP TABLE "account_custom_field"`);
        await queryRunner.query(`DROP TYPE "public"."account_custom_field_type_enum"`);
    }

}

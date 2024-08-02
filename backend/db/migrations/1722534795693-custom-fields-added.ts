import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomFieldsAdded1722534795693 implements MigrationInterface {
    name = 'CustomFieldsAdded1722534795693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_custom_field" ADD "prefixed_field_id" character varying`);
        await queryRunner.query(`ALTER TABLE "account_custom_field" ADD CONSTRAINT "UQ_f7d2bf2f1b76144d704a1ca4ad9" UNIQUE ("prefixed_field_id")`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" ADD "prefixed_field_id" character varying`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" ADD CONSTRAINT "UQ_8a8e43e84b7dabfe5590ae184bf" UNIQUE ("prefixed_field_id")`);
        await queryRunner.query(`ALTER TABLE "account_custom_field" DROP CONSTRAINT "PK_5412b7246db75412ec5e09c7756"`);
        await queryRunner.query(`ALTER TABLE "account_custom_field" DROP COLUMN "custom_field_id"`);
        await queryRunner.query(`ALTER TABLE "account_custom_field" ADD "custom_field_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account_custom_field" ADD CONSTRAINT "PK_5412b7246db75412ec5e09c7756" PRIMARY KEY ("custom_field_id")`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" DROP CONSTRAINT "PK_2cefc971c624bae336325a753e9"`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" DROP COLUMN "custom_field_id"`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" ADD "custom_field_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" ADD CONSTRAINT "PK_2cefc971c624bae336325a753e9" PRIMARY KEY ("custom_field_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_custom_field" DROP CONSTRAINT "PK_2cefc971c624bae336325a753e9"`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" DROP COLUMN "custom_field_id"`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" ADD "custom_field_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" ADD CONSTRAINT "PK_2cefc971c624bae336325a753e9" PRIMARY KEY ("custom_field_id")`);
        await queryRunner.query(`ALTER TABLE "account_custom_field" DROP CONSTRAINT "PK_5412b7246db75412ec5e09c7756"`);
        await queryRunner.query(`ALTER TABLE "account_custom_field" DROP COLUMN "custom_field_id"`);
        await queryRunner.query(`ALTER TABLE "account_custom_field" ADD "custom_field_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "account_custom_field" ADD CONSTRAINT "PK_5412b7246db75412ec5e09c7756" PRIMARY KEY ("custom_field_id")`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" DROP CONSTRAINT "UQ_8a8e43e84b7dabfe5590ae184bf"`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" DROP COLUMN "prefixed_field_id"`);
        await queryRunner.query(`ALTER TABLE "account_custom_field" DROP CONSTRAINT "UQ_f7d2bf2f1b76144d704a1ca4ad9"`);
        await queryRunner.query(`ALTER TABLE "account_custom_field" DROP COLUMN "prefixed_field_id"`);
    }

}

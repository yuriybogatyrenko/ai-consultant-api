import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientCustomFieldsValuesAdded1722563817152 implements MigrationInterface {
    name = 'ClientCustomFieldsValuesAdded1722563817152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_custom_field_value" ("id" SERIAL NOT NULL, "value" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "custom_field_id" integer, "contact_id" uuid, CONSTRAINT "PK_c27139e5791cdcb0c2ce43ea590" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" DROP COLUMN "field_value"`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field_value" ADD CONSTRAINT "FK_f15755ef941de66b40cff819a39" FOREIGN KEY ("custom_field_id") REFERENCES "contact_custom_field"("custom_field_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field_value" ADD CONSTRAINT "FK_d03472e64156a276708a9b8d1a9" FOREIGN KEY ("contact_id") REFERENCES "contact"("contact_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_custom_field_value" DROP CONSTRAINT "FK_d03472e64156a276708a9b8d1a9"`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field_value" DROP CONSTRAINT "FK_f15755ef941de66b40cff819a39"`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" ADD "field_value" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "contact_custom_field_value"`);
    }

}

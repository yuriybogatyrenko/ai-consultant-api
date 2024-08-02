import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientCustomFieldsValuesAdded1722567739043 implements MigrationInterface {
    name = 'ClientCustomFieldsValuesAdded1722567739043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "account_custom_field_custom_field_id_seq" OWNED BY "account_custom_field"."custom_field_id"`);
        await queryRunner.query(`ALTER TABLE "account_custom_field" ALTER COLUMN "custom_field_id" SET DEFAULT nextval('"account_custom_field_custom_field_id_seq"')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_custom_field" ALTER COLUMN "custom_field_id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "account_custom_field_custom_field_id_seq"`);
    }

}

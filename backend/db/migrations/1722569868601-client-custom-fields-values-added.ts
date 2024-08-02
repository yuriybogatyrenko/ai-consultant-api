import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientCustomFieldsValuesAdded1722569868601 implements MigrationInterface {
    name = 'ClientCustomFieldsValuesAdded1722569868601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_custom_field" DROP CONSTRAINT "FK_7bb4b57ca338362ca0bb5ce08f3"`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" RENAME COLUMN "contact_id" TO "account_id"`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" ADD CONSTRAINT "FK_95446b7031fa8e18fd9d316d1ef" FOREIGN KEY ("account_id") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_custom_field" DROP CONSTRAINT "FK_95446b7031fa8e18fd9d316d1ef"`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" RENAME COLUMN "account_id" TO "contact_id"`);
        await queryRunner.query(`ALTER TABLE "contact_custom_field" ADD CONSTRAINT "FK_7bb4b57ca338362ca0bb5ce08f3" FOREIGN KEY ("contact_id") REFERENCES "contact"("contact_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

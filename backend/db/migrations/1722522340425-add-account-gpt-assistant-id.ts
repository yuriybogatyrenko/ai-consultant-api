import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAccountGptAssistantId1722522340425 implements MigrationInterface {
    name = 'AddAccountGptAssistantId1722522340425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "gpt_assistant_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "gpt_assistant_id"`);
    }

}

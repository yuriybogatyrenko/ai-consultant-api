import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsContactThreads1723732708015 implements MigrationInterface {
    name = 'AddFieldsContactThreads1723732708015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_thread" ADD "platform_chat_id" character varying`);
        await queryRunner.query(`ALTER TABLE "contact_message" ALTER COLUMN "content" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_message" ALTER COLUMN "content" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact_thread" DROP COLUMN "platform_chat_id"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1722498511597 implements MigrationInterface {
    name = 'InitMigration1722498511597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_thread" ADD "gpt_thread_id" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."contact_thread_status_enum" AS ENUM('active', 'archived', 'closed', 'pending')`);
        await queryRunner.query(`ALTER TABLE "contact_thread" ADD "status" "public"."contact_thread_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "contact_thread" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "platoform_message_id" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "platform_username" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "language_code" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "phone_number" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "platform_instagram_setting" ADD "gpt_assistant_id" character varying`);
        await queryRunner.query(`ALTER TABLE "platform_telegram_setting" ADD "gpt_assistant_id" character varying`);
        await queryRunner.query(`ALTER TABLE "platform_whats_app_setting" ADD "gpt_assistant_id" character varying`);
        await queryRunner.query(`ALTER TABLE "contact_thread" DROP CONSTRAINT "FK_bd1c8052e8a4b2d105b388f5798"`);
        await queryRunner.query(`ALTER TABLE "contact_thread" ADD CONSTRAINT "UQ_bd1c8052e8a4b2d105b388f5798" UNIQUE ("contactContactId")`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "platform_user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "UQ_3bdccdb674dfc3670951d0d930d" UNIQUE ("platform_user_id")`);
        await queryRunner.query(`ALTER TABLE "contact_thread" ADD CONSTRAINT "FK_bd1c8052e8a4b2d105b388f5798" FOREIGN KEY ("contactContactId") REFERENCES "contact"("contact_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_thread" ADD CONSTRAINT "FK_d07ad1d0f49a79d3bce7f05cb43" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_thread" DROP CONSTRAINT "FK_d07ad1d0f49a79d3bce7f05cb43"`);
        await queryRunner.query(`ALTER TABLE "contact_thread" DROP CONSTRAINT "FK_bd1c8052e8a4b2d105b388f5798"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "UQ_3bdccdb674dfc3670951d0d930d"`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "platform_user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact_thread" DROP CONSTRAINT "UQ_bd1c8052e8a4b2d105b388f5798"`);
        await queryRunner.query(`ALTER TABLE "contact_thread" ADD CONSTRAINT "FK_bd1c8052e8a4b2d105b388f5798" FOREIGN KEY ("contactContactId") REFERENCES "contact"("contact_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "platform_whats_app_setting" DROP COLUMN "gpt_assistant_id"`);
        await queryRunner.query(`ALTER TABLE "platform_telegram_setting" DROP COLUMN "gpt_assistant_id"`);
        await queryRunner.query(`ALTER TABLE "platform_instagram_setting" DROP COLUMN "gpt_assistant_id"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "language_code"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "platform_username"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "platoform_message_id"`);
        await queryRunner.query(`ALTER TABLE "contact_thread" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "contact_thread" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."contact_thread_status_enum"`);
        await queryRunner.query(`ALTER TABLE "contact_thread" DROP COLUMN "gpt_thread_id"`);
    }

}

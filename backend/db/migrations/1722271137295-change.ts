import { MigrationInterface, QueryRunner } from "typeorm";

export class Change1722271137295 implements MigrationInterface {
    name = 'Change1722271137295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "platform_telegram_setting" DROP CONSTRAINT "FK_a7d52d43f8faf9edac5594bc24a"`);
        await queryRunner.query(`ALTER TABLE "platform_telegram_setting" RENAME COLUMN "accountAccountId" TO "account_id"`);
        await queryRunner.query(`ALTER TABLE "platform_telegram_setting" ADD CONSTRAINT "FK_5ba1b9cdf02a6db8b9b5361f8c0" FOREIGN KEY ("account_id") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "platform_telegram_setting" DROP CONSTRAINT "FK_5ba1b9cdf02a6db8b9b5361f8c0"`);
        await queryRunner.query(`ALTER TABLE "platform_telegram_setting" RENAME COLUMN "account_id" TO "accountAccountId"`);
        await queryRunner.query(`ALTER TABLE "platform_telegram_setting" ADD CONSTRAINT "FK_a7d52d43f8faf9edac5594bc24a" FOREIGN KEY ("accountAccountId") REFERENCES "account"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

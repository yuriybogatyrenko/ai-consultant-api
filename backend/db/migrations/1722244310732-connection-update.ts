import { MigrationInterface, QueryRunner } from "typeorm";

export class ConnectionUpdate1722244310732 implements MigrationInterface {
    name = 'ConnectionUpdate1722244310732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "telegramSettingsId" uuid`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "UQ_df894821d0ab794e0706063f789" UNIQUE ("telegramSettingsId")`);
        await queryRunner.query(`ALTER TABLE "account" ADD "whatsappSettingsId" uuid`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "UQ_78b2b2ff5c9c86b7e14eada5207" UNIQUE ("whatsappSettingsId")`);
        await queryRunner.query(`ALTER TABLE "account" ADD "instagramSettingsId" uuid`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "UQ_8593bfff73ad9f140a7107f1539" UNIQUE ("instagramSettingsId")`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_df894821d0ab794e0706063f789" FOREIGN KEY ("telegramSettingsId") REFERENCES "platform_telegram_setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_78b2b2ff5c9c86b7e14eada5207" FOREIGN KEY ("whatsappSettingsId") REFERENCES "platform_whats_app_setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_8593bfff73ad9f140a7107f1539" FOREIGN KEY ("instagramSettingsId") REFERENCES "platform_instagram_setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_8593bfff73ad9f140a7107f1539"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_78b2b2ff5c9c86b7e14eada5207"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_df894821d0ab794e0706063f789"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_8593bfff73ad9f140a7107f1539"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "instagramSettingsId"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_78b2b2ff5c9c86b7e14eada5207"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "whatsappSettingsId"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_df894821d0ab794e0706063f789"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "telegramSettingsId"`);
    }

}

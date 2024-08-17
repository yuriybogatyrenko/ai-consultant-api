import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountFieldsAdd1723743056673 implements MigrationInterface {
    name = 'AccountFieldsAdd1723743056673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "use_gpt" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "account" ADD "use_gpt_whisper" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "use_gpt_whisper"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "use_gpt"`);
    }

}

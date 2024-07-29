import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGptKey1722243535838 implements MigrationInterface {
    name = 'AddGptKey1722243535838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "gpt_api_key" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."user_entity_user_type_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "user_type" "public"."user_entity_user_type_enum" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "user_type"`);
        await queryRunner.query(`DROP TYPE "public"."user_entity_user_type_enum"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "gpt_api_key"`);
    }

}

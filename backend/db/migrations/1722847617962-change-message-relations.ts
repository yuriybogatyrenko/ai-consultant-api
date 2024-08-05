import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeMessageRelations1722847617962 implements MigrationInterface {
    name = 'ChangeMessageRelations1722847617962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contact_message_message_type_enum" AS ENUM('text', 'image', 'video', 'audio', 'document')`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "message_type" "public"."contact_message_message_type_enum" DEFAULT 'text'`);
        await queryRunner.query(`CREATE TYPE "public"."contact_message_message_direction_enum" AS ENUM('incoming', 'outgoing', 'system')`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "message_direction" "public"."contact_message_message_direction_enum" DEFAULT 'system'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "message_direction"`);
        await queryRunner.query(`DROP TYPE "public"."contact_message_message_direction_enum"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "message_type"`);
        await queryRunner.query(`DROP TYPE "public"."contact_message_message_type_enum"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeMessageRelations1722835228554 implements MigrationInterface {
    name = 'ChangeMessageRelations1722835228554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "contact_message" ALTER COLUMN "platform" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD CONSTRAINT "FK_0305ea5cbf6c1a216c8edca2f8e" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_message" DROP CONSTRAINT "FK_0305ea5cbf6c1a216c8edca2f8e"`);
        await queryRunner.query(`ALTER TABLE "contact_message" ALTER COLUMN "platform" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "userId"`);
    }

}

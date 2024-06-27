import { MigrationInterface, QueryRunner } from "typeorm";

export class INITIALMIGRATION1719289365159 implements MigrationInterface {
    name = 'INITIALMIGRATION1719289365159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "api_key_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_c5f6e7e726a6d74c77fde1fdddb" UNIQUE ("key"), CONSTRAINT "PK_4c0ab209778e65782d430d7ee69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "api_key_entity" ADD CONSTRAINT "FK_b67bd291b87edb6bdd4ca0c87a5" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_key_entity" DROP CONSTRAINT "FK_b67bd291b87edb6bdd4ca0c87a5"`);
        await queryRunner.query(`DROP TABLE "api_key_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }

}

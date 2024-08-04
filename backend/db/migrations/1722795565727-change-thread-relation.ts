import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeThreadRelation1722795565727 implements MigrationInterface {
    name = 'ChangeThreadRelation1722795565727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_thread" DROP CONSTRAINT "FK_bd1c8052e8a4b2d105b388f5798"`);
        await queryRunner.query(`ALTER TABLE "contact_thread" DROP CONSTRAINT "REL_bd1c8052e8a4b2d105b388f579"`);
        await queryRunner.query(`ALTER TABLE "contact_thread" ADD CONSTRAINT "FK_bd1c8052e8a4b2d105b388f5798" FOREIGN KEY ("contactContactId") REFERENCES "contact"("contact_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_thread" DROP CONSTRAINT "FK_bd1c8052e8a4b2d105b388f5798"`);
        await queryRunner.query(`ALTER TABLE "contact_thread" ADD CONSTRAINT "REL_bd1c8052e8a4b2d105b388f579" UNIQUE ("contactContactId")`);
        await queryRunner.query(`ALTER TABLE "contact_thread" ADD CONSTRAINT "FK_bd1c8052e8a4b2d105b388f5798" FOREIGN KEY ("contactContactId") REFERENCES "contact"("contact_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

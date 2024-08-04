import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeThreadRelation1722796287601 implements MigrationInterface {
    name = 'ChangeThreadRelation1722796287601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "UQ_3bdccdb674dfc3670951d0d930d"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "UQ_3bdccdb674dfc3670951d0d930d" UNIQUE ("platform_user_id")`);
    }

}

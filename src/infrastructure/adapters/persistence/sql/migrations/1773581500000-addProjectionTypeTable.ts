import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectionTypeTable1773581500000 implements MigrationInterface {
    name = 'AddProjectionTypeTable1773581500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projection-type" ("id" SERIAL NOT NULL, "type_name" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_projection_type" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "projection-type"`);
    }
}

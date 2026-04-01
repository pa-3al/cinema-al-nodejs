import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMovieAndScreeningTables1774809000000 implements MigrationInterface {
    name = "AddMovieAndScreeningTables1774809000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "movie" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "synopsis" text NOT NULL, "durationMinutes" integer NOT NULL, "releaseDate" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "screening" ("id" SERIAL NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "movie_id" integer NOT NULL, "room_id" integer NOT NULL, CONSTRAINT "CHK_8f8de4f64d2908bb8b25ed02a2" CHECK ("startTime" < "endTime"), CONSTRAINT "PK_c2d7b033d46f627df8378d5ac27" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE INDEX "IDX_aee9ca2eec92334fc57ef6f8b9" ON "screening" ("movie_id", "startTime") `);
        await queryRunner.query(`CREATE INDEX "IDX_77ee16bdbaf567b6c3f52ca531" ON "screening" ("room_id", "startTime") `);
        await queryRunner.query(
            `ALTER TABLE "screening" ADD CONSTRAINT "FK_f0b95f17101ef6cbf26108307a4" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "screening" ADD CONSTRAINT "FK_0a18ad6bd99f86e44f12f4ca5ff" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "FK_0a18ad6bd99f86e44f12f4ca5ff"`);
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "FK_f0b95f17101ef6cbf26108307a4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_77ee16bdbaf567b6c3f52ca531"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aee9ca2eec92334fc57ef6f8b9"`);
        await queryRunner.query(`DROP TABLE "screening"`);
        await queryRunner.query(`DROP TABLE "movie"`);
    }
}

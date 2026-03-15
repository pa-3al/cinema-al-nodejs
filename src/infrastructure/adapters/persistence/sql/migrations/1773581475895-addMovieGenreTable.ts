import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMovieGenreTable1773581475895 implements MigrationInterface {
    name = 'AddMovieGenreTable1773581475895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movie-genre" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_22c4f5669764285a03b48cca1e2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "movie-genre"`);
    }

}

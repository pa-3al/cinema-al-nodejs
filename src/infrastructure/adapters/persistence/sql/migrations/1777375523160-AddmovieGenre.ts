import { MigrationInterface, QueryRunner } from "typeorm";

export class AddmovieGenre1777375523160 implements MigrationInterface {
    name = 'AddmovieGenre1777375523160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "genre_id" integer`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "FK_2d145b3164d0e5a4bf03eddf15d" FOREIGN KEY ("genre_id") REFERENCES "movie-genre"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "FK_2d145b3164d0e5a4bf03eddf15d"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "genre_id"`);
    }

}

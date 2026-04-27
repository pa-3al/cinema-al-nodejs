import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoomAndMovieField1776887354502 implements MigrationInterface {
    name = 'AddRoomAndMovieField1776887354502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "FK_f0b95f17101ef6cbf26108307a4"`);
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "FK_0a18ad6bd99f86e44f12f4ca5ff"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aee9ca2eec92334fc57ef6f8b9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_77ee16bdbaf567b6c3f52ca531"`);
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "CHK_8f8de4f64d2908bb8b25ed02a2"`);
        await queryRunner.query(`CREATE TABLE "ticket_price" ("id" SERIAL NOT NULL, "price" double precision NOT NULL, "start_activity" TIMESTAMP NOT NULL, "end_activity" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "projection_type_id" integer NOT NULL, CONSTRAINT "PK_fd298dee3debbf2183a91a28eb9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ticket_usage" ("id" SERIAL NOT NULL, "used_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "ticket_id" integer NOT NULL, "screening_id" integer NOT NULL, CONSTRAINT "PK_0c8d23445b4deff5526c8d9ee25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a38c7ff599d54b3e4137ad15f0" ON "ticket_usage" ("ticket_id", "screening_id") `);
        await queryRunner.query(`CREATE TABLE "tickets" ("id" SERIAL NOT NULL, "ticket_type" character varying(10) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(255) NOT NULL, "amount" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "posterUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "room" ADD "isHandicapAccessible" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "room" ADD "projection_type_id" integer`);
        await queryRunner.query(`ALTER TABLE "ticket_price" ADD CONSTRAINT "FK_2d5438e6a0752e6508e94a8b1c4" FOREIGN KEY ("projection_type_id") REFERENCES "projection-type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_d783db96fde79406c45fe280a54" FOREIGN KEY ("projection_type_id") REFERENCES "projection-type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "FK_f6541a70adcd0716eef90407526" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "FK_d0edf6ec9af6f344e5aeb463a0c" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_usage" ADD CONSTRAINT "FK_8c7f6bfc2816a86e444c351f831" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_usage" ADD CONSTRAINT "FK_a6bef4048b006713fe363a047a5" FOREIGN KEY ("screening_id") REFERENCES "screening"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_2e445270177206a97921e461710" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_2e445270177206a97921e461710"`);
        await queryRunner.query(`ALTER TABLE "ticket_usage" DROP CONSTRAINT "FK_a6bef4048b006713fe363a047a5"`);
        await queryRunner.query(`ALTER TABLE "ticket_usage" DROP CONSTRAINT "FK_8c7f6bfc2816a86e444c351f831"`);
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "FK_d0edf6ec9af6f344e5aeb463a0c"`);
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "FK_f6541a70adcd0716eef90407526"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_d783db96fde79406c45fe280a54"`);
        await queryRunner.query(`ALTER TABLE "ticket_price" DROP CONSTRAINT "FK_2d5438e6a0752e6508e94a8b1c4"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "projection_type_id"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "isHandicapAccessible"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "posterUrl"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "tickets"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a38c7ff599d54b3e4137ad15f0"`);
        await queryRunner.query(`DROP TABLE "ticket_usage"`);
        await queryRunner.query(`DROP TABLE "ticket_price"`);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "CHK_8f8de4f64d2908bb8b25ed02a2" CHECK (("startTime" < "endTime"))`);
        await queryRunner.query(`CREATE INDEX "IDX_77ee16bdbaf567b6c3f52ca531" ON "screening" ("room_id", "startTime") `);
        await queryRunner.query(`CREATE INDEX "IDX_aee9ca2eec92334fc57ef6f8b9" ON "screening" ("movie_id", "startTime") `);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "FK_0a18ad6bd99f86e44f12f4ca5ff" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "FK_f0b95f17101ef6cbf26108307a4" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

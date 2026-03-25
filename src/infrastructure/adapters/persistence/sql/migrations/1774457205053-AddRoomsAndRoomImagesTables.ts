import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoomsAndRoomImagesTables1774457205053 implements MigrationInterface {
    name = 'AddRoomsAndRoomImagesTables1774457205053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "room-image" ("id" SERIAL NOT NULL, "imageUrl" character varying NOT NULL, "displayOrder" integer NOT NULL, "room_id" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_fb1ce6dc4a7089645df5e912826" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "capacity" integer NOT NULL, "isMaintenance" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "room-image" ADD CONSTRAINT "FK_d7dc3b92a187eaae3d05f924875" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room-image" DROP CONSTRAINT "FK_d7dc3b92a187eaae3d05f924875"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "room-image"`);
    }

}

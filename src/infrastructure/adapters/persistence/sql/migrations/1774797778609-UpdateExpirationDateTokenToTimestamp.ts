import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExpirationDateTokenToTimestamp1774797778609 implements MigrationInterface {
    name = 'UpdateExpirationDateTokenToTimestamp1774797778609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh-tokens" DROP COLUMN "expired_at"`);
        await queryRunner.query(`ALTER TABLE "refresh-tokens" ADD "expired_at" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh-tokens" DROP COLUMN "expired_at"`);
        await queryRunner.query(`ALTER TABLE "refresh-tokens" ADD "expired_at" date NOT NULL`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeEmployeeScheduleDayToISO86011774801114462 implements MigrationInterface {
    name = 'ChangeEmployeeScheduleDayToISO86011774801114462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees_schedules" DROP COLUMN "workDate"`);
        await queryRunner.query(`ALTER TABLE "employees_schedules" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "employees_schedules" ADD "startTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employees_schedules" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "employees_schedules" ADD "endTime" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees_schedules" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "employees_schedules" ADD "endTime" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employees_schedules" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "employees_schedules" ADD "startTime" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employees_schedules" ADD "workDate" date NOT NULL`);
    }

}

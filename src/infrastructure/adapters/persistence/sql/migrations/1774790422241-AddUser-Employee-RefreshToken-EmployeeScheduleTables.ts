import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserEmployeeRefreshTokenEmployeeScheduleTables1774790422241 implements MigrationInterface {
    name = 'AddUserEmployeeRefreshTokenEmployeeScheduleTables1774790422241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh-tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" text NOT NULL, "expired_at" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_8c3ca3e3f1ad4fb45ec6b793aa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employees_schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workDate" date NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "employee_id" uuid, CONSTRAINT "PK_edca5e0a599bc6300be102ff35e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "user_id" uuid, CONSTRAINT "REL_2d83c53c3e553a48dadb9722e3" UNIQUE ("user_id"), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'employee', 'super_admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "firstname" character varying(255) NOT NULL, "lastname" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "balance" double precision NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refresh-tokens" ADD CONSTRAINT "FK_36f06086d2187ca909a4cf79030" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employees_schedules" ADD CONSTRAINT "FK_66dd6ed1015a2ec6032d6ae1eb9" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38"`);
        await queryRunner.query(`ALTER TABLE "employees_schedules" DROP CONSTRAINT "FK_66dd6ed1015a2ec6032d6ae1eb9"`);
        await queryRunner.query(`ALTER TABLE "refresh-tokens" DROP CONSTRAINT "FK_36f06086d2187ca909a4cf79030"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TABLE "employees_schedules"`);
        await queryRunner.query(`DROP TABLE "refresh-tokens"`);
    }

}

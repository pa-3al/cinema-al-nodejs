import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity("projection-type")
export class ProjectionType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: "type_name",
        type: "varchar",
        nullable: false,
        length: 255,
    })
    typeName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

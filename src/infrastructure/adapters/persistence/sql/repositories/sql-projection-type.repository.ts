import {Injectable} from "@nestjs/common";
import {IProjectionTypeRepository} from "../../../../../core/domain/cinema/projection-type/port/projection-type-repository.port";
import {ProjectionType} from "../entities/projection-type.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class SqlProjectionTypeRepository implements IProjectionTypeRepository {

    constructor(
        @InjectRepository(ProjectionType)
        private readonly projectionTypeRepository : Repository<ProjectionType>,
    ){}

    async findAll({page, size} : {page : number, size : number}) {
        const query = this.projectionTypeRepository.createQueryBuilder();
        query.skip((page - 1) * size);
        query.take(size);

        const [projectionTypes, totalCount] = await query.getManyAndCount();
        return {
            data: projectionTypes,
            size: size,
            page,
            totalCount,
            totalPage: Math.ceil(totalCount / size)
        };
    }

    async findById(id: number) : Promise<ProjectionType | null> {
        return await this.projectionTypeRepository.findOneBy({ id });
    }

    create(projectionType: Partial<ProjectionType>) : ProjectionType {
        return this.projectionTypeRepository.create(projectionType);
    }

    async save(projectionType: Partial<ProjectionType>) : Promise<ProjectionType> {
        return this.projectionTypeRepository.save(projectionType);
    }

    async update(id: number, projectionType: Partial<ProjectionType>) : Promise<ProjectionType | null> {
        const found = await this.projectionTypeRepository.findOneBy({ id });

        if (found === null) {
            return null;
        }

        if (projectionType.typeName != null) {
            found.typeName = projectionType.typeName;
        }

        return await this.projectionTypeRepository.save(found);
    }

    async delete(id: number) : Promise<ProjectionType | null> {
        const projectionType = await this.projectionTypeRepository.findOneBy({ id });

        if (projectionType === null) {
            return null;
        }

        await this.projectionTypeRepository.softRemove(projectionType);

        return projectionType;
    }
}

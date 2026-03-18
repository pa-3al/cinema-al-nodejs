import {IProjectionTypeServicePort} from "../../../domain/cinema/projection-type/port/projection-type-service.port";
import {Inject, Injectable} from "@nestjs/common";
import {PROJECTION_TYPE_REPOSITORY} from "../../../domain/global/token";
import * as projectionTypeRepositoryPort from "../../../domain/cinema/projection-type/port/projection-type-repository.port";
import {
    AllProjectionTypeDto,
    CreateAndUpdateProjectionTypeDto,
    ProjectionTypeDetailDto
} from "../../../domain/cinema/projection-type/dto/projection-type.dto";
import {IdNumberParamDto, PaginationQueryDto} from "../../../domain/global/dto/global.dto";

@Injectable()
export class ProjectionTypeService implements IProjectionTypeServicePort {

    constructor(
        @Inject(PROJECTION_TYPE_REPOSITORY)
        private readonly projectionTypeRepository: projectionTypeRepositoryPort.IProjectionTypeRepository,
    ){}

    async create(projectionType: CreateAndUpdateProjectionTypeDto) : Promise<ProjectionTypeDetailDto> {
        const created = this.projectionTypeRepository.create(projectionType);
        return await this.projectionTypeRepository.save(created);
    }

    async findOne(idParam: IdNumberParamDto) : Promise<ProjectionTypeDetailDto | null> {
        return await this.projectionTypeRepository.findById(idParam.id);
    }

    async findAll(paginationParam : PaginationQueryDto) : Promise<AllProjectionTypeDto> {
        let page = 1;
        let size = 10;
        if (paginationParam.page != null) {
            page = paginationParam.page;
        }
        if (paginationParam.size != null && paginationParam.size < 100) {
            size = paginationParam.size;
        }
        return await this.projectionTypeRepository.findAll({page, size});
    }

    async update(idParam : IdNumberParamDto, projectionType : CreateAndUpdateProjectionTypeDto) : Promise<ProjectionTypeDetailDto | null> {
        return await this.projectionTypeRepository.update(idParam.id, projectionType);
    }

    async delete(idParam : IdNumberParamDto) : Promise<ProjectionTypeDetailDto | null> {
        return await this.projectionTypeRepository.delete(idParam.id);
    }
}

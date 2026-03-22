import {AllProjectionTypeDto, CreateAndUpdateProjectionTypeDto, ProjectionTypeDetailDto} from "../dto/projection-type.dto";
import {IdNumberParamDto, PaginationQueryDto} from "../../../global/dto/global.dto";

export interface IProjectionTypeServicePort {
    create(projectionType : CreateAndUpdateProjectionTypeDto) : Promise<ProjectionTypeDetailDto>;
    findAll(paginationQuery : PaginationQueryDto) : Promise<AllProjectionTypeDto>;
    findOne(idParam : IdNumberParamDto) : Promise<ProjectionTypeDetailDto | null>;
    update(idParam : IdNumberParamDto, projectionType : CreateAndUpdateProjectionTypeDto) : Promise<ProjectionTypeDetailDto | null>;
    delete(idParam : IdNumberParamDto) : Promise<ProjectionTypeDetailDto | null>;
}

import {ProjectionType} from "../../../../../infrastructure/adapters/persistence/sql/entities/projection-type.entity";
import {getAllResponse} from "../../../global/types/global.type";

export interface IProjectionTypeRepository {
    findAll({page, size} : {page : number, size : number}) : Promise<getAllResponse<ProjectionType>>;
    findById(id : number) : Promise<ProjectionType | null>;
    create(projectionType: Partial<ProjectionType>) : ProjectionType;
    save(projectionType: ProjectionType) : Promise<ProjectionType>;
    update(id:number, projectionType: Partial<ProjectionType>) : Promise<ProjectionType | null>;
    delete(id:number) : Promise<ProjectionType | null>;
}

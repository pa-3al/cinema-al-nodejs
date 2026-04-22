import {
    AllScreeningDto,
    CreateScreeningDto,
    ScreeningDetailDto,
    ScreeningQueryDto,
    UpdateScreeningDto
} from "../dto/screening.dto";
import {IdNumberParamDto} from "../../../global/dto/global.dto";

export interface IScreeningServicePort {
    create(screening: CreateScreeningDto): Promise<ScreeningDetailDto>;
    findAll(query: ScreeningQueryDto): Promise<AllScreeningDto>;
    findOne(idParam: IdNumberParamDto): Promise<ScreeningDetailDto | null>;
    update(idParam: IdNumberParamDto, screening: UpdateScreeningDto): Promise<ScreeningDetailDto | null>;
    delete(idParam: IdNumberParamDto): Promise<ScreeningDetailDto | null>;
}

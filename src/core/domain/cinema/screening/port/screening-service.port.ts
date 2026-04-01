import { AllScreeningDto, CreateScreeningDto, ScreeningDetailDto, ScreeningQueryDto } from "../dto/screening.dto";

export interface IScreeningServicePort {
    create(screening: CreateScreeningDto): Promise<ScreeningDetailDto>;
    findAll(query: ScreeningQueryDto): Promise<AllScreeningDto>;
}

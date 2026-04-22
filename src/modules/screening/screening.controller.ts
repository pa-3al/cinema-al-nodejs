import {
    Body,
    Controller, Delete,
    Get, HttpCode, HttpStatus,
    Inject, NotFoundException, Param, Patch,
    Post,
    Query,
    UseGuards
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse, ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation, ApiParam,
    ApiTags
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/core/application/cinema/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/core/application/cinema/auth/guards/roles.guard";
import { Roles } from "src/core/application/cinema/auth/decorators/roles.decorator";
import {
    AllScreeningDto,
    CreateScreeningDto,
    ScreeningDetailDto,
    ScreeningQueryDto,
    UpdateScreeningDto
} from "src/core/domain/cinema/screening/dto/screening.dto";
import type { IScreeningServicePort } from "src/core/domain/cinema/screening/port/screening-service.port";
import { SCREENING_SERVICE } from "src/core/domain/global/token";
import {IdNumberParamDto} from "../../core/domain/global/dto/global.dto";

@ApiTags("Screenings")
@Controller("screenings")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ScreeningController {

    constructor(
        @Inject(SCREENING_SERVICE)
        private readonly screeningService: IScreeningServicePort
    ) {}

    @Post()
    @Roles("employee", "super_admin")
    @ApiOperation({ summary: "Create a screening (employee or super_admin only)" })
    @ApiCreatedResponse({ type: ScreeningDetailDto })
    @ApiBody({ type: CreateScreeningDto })
    async create(@Body() body: CreateScreeningDto) {
        return await this.screeningService.create(body);
    }

    @Get()
    @ApiOperation({ summary: "Get screenings with optional filters" })
    @ApiOkResponse({ type: AllScreeningDto })
    async findAll(@Query() query: ScreeningQueryDto) {
        return await this.screeningService.findAll(query);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a screening by id" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: ScreeningDetailDto })
    @ApiNotFoundResponse({ description: "Screening not found" })
    async findOne(@Param() idParam: IdNumberParamDto) {
        const screening = await this.screeningService.findOne(idParam);
        if (!screening) {
            throw new NotFoundException(`Screening with id ${idParam.id} not found`);
        }
        return screening;
    }

    @Patch(":id")
    @Roles("employee", "super_admin")
    @ApiOperation({ summary: "Update a screening (employee or super_admin only)" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: ScreeningDetailDto })
    @ApiNotFoundResponse({ description: "Screening not found" })
    @ApiBody({ type: UpdateScreeningDto })
    async update(
        @Param() idParam: IdNumberParamDto,
        @Body() body: UpdateScreeningDto
    ) {
        const screening = await this.screeningService.update(idParam, body);
        if (!screening) {
            throw new NotFoundException(`Screening with id ${idParam.id} not found`);
        }
        return screening;
    }

    @Delete(":id")
    @Roles("employee", "super_admin")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Delete a screening (employee or super_admin only)" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: ScreeningDetailDto })
    @ApiNotFoundResponse({ description: "Screening not found" })
    async delete(@Param() idParam: IdNumberParamDto) {
        const screening = await this.screeningService.delete(idParam);
        if (!screening) {
            throw new NotFoundException(`Screening with id ${idParam.id} not found`);
        }
        return screening;
    }
}

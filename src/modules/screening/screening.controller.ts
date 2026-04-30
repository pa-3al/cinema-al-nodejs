import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    Logger
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse
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
import { IdNumberParamDto } from "../../core/domain/global/dto/global.dto";

@ApiTags("Screenings")
@Controller("screenings")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ScreeningController {
    private readonly logger = new Logger(ScreeningController.name);

    constructor(
        @Inject(SCREENING_SERVICE)
        private readonly screeningService: IScreeningServicePort
    ) {}

    @Post()
    @Roles("employee", "super_admin")
    @ApiOperation({ summary: "Create a screening (employee or super_admin only)" })
    @ApiCreatedResponse({ type: ScreeningDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid payload data or scheduling conflict" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: CreateScreeningDto })
    async create(@Body() body: CreateScreeningDto) {
        this.logger.log(`Creating new screening for movie ID: ${body.movieId} in room ID: ${body.roomId}`);
        return await this.screeningService.create(body);
    }

    @Get()
    @ApiOperation({ summary: "Get screenings with optional filters" })
    @ApiOkResponse({ type: AllScreeningDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid query parameters" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findAll(@Query() query: ScreeningQueryDto) {
        this.logger.log(`Fetching screenings with filters: ${JSON.stringify(query)}`);
        return await this.screeningService.findAll(query);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a screening by id" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: ScreeningDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: "Screening not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findOne(@Param() idParam: IdNumberParamDto) {
        this.logger.log(`Fetching screening by id: ${idParam.id}`);
        const screening = await this.screeningService.findOne(idParam);
        if (!screening) {
            this.logger.warn(`Screening with id ${idParam.id} not found`);
            throw new NotFoundException(`Screening with id ${idParam.id} not found`);
        }
        return screening;
    }

    @Patch(":id")
    @Roles("employee", "super_admin")
    @ApiOperation({ summary: "Update a screening (employee or super_admin only)" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: ScreeningDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid parameters or scheduling conflict" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Screening not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: UpdateScreeningDto })
    async update(
        @Param() idParam: IdNumberParamDto,
        @Body() body: UpdateScreeningDto
    ) {
        this.logger.log(`Updating screening with id: ${idParam.id}`);
        const screening = await this.screeningService.update(idParam, body);
        if (!screening) {
            this.logger.warn(`Failed to update. Screening with id ${idParam.id} not found`);
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
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Screening not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async delete(@Param() idParam: IdNumberParamDto) {
        this.logger.log(`Deleting screening with id: ${idParam.id}`);
        const screening = await this.screeningService.delete(idParam);
        if (!screening) {
            this.logger.warn(`Failed to delete. Screening with id ${idParam.id} not found`);
            throw new NotFoundException(`Screening with id ${idParam.id} not found`);
        }
        return screening;
    }
}
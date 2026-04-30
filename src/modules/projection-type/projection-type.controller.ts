import {
    Body,
    Controller,
    Get,
    Inject,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
    Logger
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiParam,
    ApiBody,
    ApiBearerAuth,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { PROJECTION_TYPE_SERVICE } from "../../core/domain/global/token";
import * as projectionTypeServicePort from "../../core/domain/cinema/projection-type/port/projection-type-service.port";
import { IdNumberParamDto, PaginationQueryDto } from "../../core/domain/global/dto/global.dto";
import {
    CreateAndUpdateProjectionTypeDto,
    ProjectionTypeDetailDto,
    AllProjectionTypeDto
} from "../../core/domain/cinema/projection-type/dto/projection-type.dto";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../core/application/cinema/auth/guards/roles.guard";
import { Roles } from "../../core/application/cinema/auth/decorators/roles.decorator";

@ApiTags("Projection Types")
@Controller("projection-types")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProjectionTypeController {
    private readonly logger = new Logger(ProjectionTypeController.name);

    constructor(
        @Inject(PROJECTION_TYPE_SERVICE)
        private readonly projectionTypeService: projectionTypeServicePort.IProjectionTypeServicePort
    ) {}

    @Post()
    @ApiOperation({ summary: "Create a new projection type" })
    @Roles("employee", "super_admin")
    @ApiCreatedResponse({ type: ProjectionTypeDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid body data" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: CreateAndUpdateProjectionTypeDto })
    async create(@Body() body: CreateAndUpdateProjectionTypeDto) {
        this.logger.log(`Creating new projection type: ${body.typeName}`);
        return await this.projectionTypeService.create(body);
    }

    @Get()
    @ApiOperation({ summary: "Get all projection types with pagination" })
    @ApiOkResponse({ type: AllProjectionTypeDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid query parameters" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findAll(@Query() query: PaginationQueryDto) {
        this.logger.log(`Fetching projection types with pagination: page ${query.page}, size ${query.size}`);
        return await this.projectionTypeService.findAll(query);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a projection type by id" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: ProjectionTypeDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: "Projection type not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findOne(@Param() idParam: IdNumberParamDto) {
        this.logger.log(`Fetching projection type by id: ${idParam.id}`);
        const projectionType = await this.projectionTypeService.findOne(idParam);
        if (!projectionType) {
            this.logger.warn(`Projection type with id ${idParam.id} not found`);
            throw new NotFoundException(`Projection type with id ${idParam.id} not found`);
        }
        return projectionType;
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update a projection type" })
    @Roles("employee", "super_admin")
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: ProjectionTypeDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid parameters or body" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Projection type not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: CreateAndUpdateProjectionTypeDto })
    async update(
        @Param() idParam: IdNumberParamDto,
        @Body() body: CreateAndUpdateProjectionTypeDto
    ) {
        this.logger.log(`Updating projection type with id: ${idParam.id}`);
        const projectionType = await this.projectionTypeService.update(idParam, body);
        if (!projectionType) {
            this.logger.warn(`Failed to update. Projection type with id ${idParam.id} not found`);
            throw new NotFoundException(`Projection type with id ${idParam.id} not found`);
        }
        return projectionType;
    }

    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Soft delete a projection type" })
    @Roles("employee", "super_admin")
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: ProjectionTypeDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Projection type not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async delete(@Param() idParam: IdNumberParamDto) {
        this.logger.log(`Deleting projection type with id: ${idParam.id}`);
        const projectionType = await this.projectionTypeService.delete(idParam);
        if (!projectionType) {
            this.logger.warn(`Failed to delete. Projection type with id ${idParam.id} not found`);
            throw new NotFoundException(`Projection type with id ${idParam.id} not found`);
        }
        return projectionType;
    }
}
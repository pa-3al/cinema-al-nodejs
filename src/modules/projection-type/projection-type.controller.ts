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
    HttpStatus
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiParam,
    ApiBody
} from "@nestjs/swagger";
import { PROJECTION_TYPE_SERVICE } from "../../core/domain/global/token";
import * as projectionTypeServicePort from "../../core/domain/cinema/projection-type/port/projection-type-service.port";
import { IdNumberParamDto, PaginationQueryDto } from "../../core/domain/global/dto/global.dto";
import {
    CreateAndUpdateProjectionTypeDto,
    ProjectionTypeDetailDto,
    AllProjectionTypeDto
} from "../../core/domain/cinema/projection-type/dto/projection-type.dto";

@ApiTags("Projection Types")
@Controller("projection-types")
export class ProjectionTypeController {
    constructor(
        @Inject(PROJECTION_TYPE_SERVICE)
        private readonly projectionTypeService: projectionTypeServicePort.IProjectionTypeServicePort
    ) {}

    @Post()
    @ApiOperation({ summary: "Create a new projection type" })
    @ApiCreatedResponse({ type: ProjectionTypeDetailDto })
    @ApiBody({ type: CreateAndUpdateProjectionTypeDto })
    async create(@Body() body: CreateAndUpdateProjectionTypeDto) {
        return await this.projectionTypeService.create(body);
    }

    @Get()
    @ApiOperation({ summary: "Get all projection types with pagination" })
    @ApiOkResponse({ type: AllProjectionTypeDto })
    async findAll(@Query() query: PaginationQueryDto) {
        return await this.projectionTypeService.findAll(query);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a projection type by id" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: ProjectionTypeDetailDto })
    @ApiNotFoundResponse({ description: "Projection type not found" })
    async findOne(@Param() idParam: IdNumberParamDto) {
        const projectionType = await this.projectionTypeService.findOne(idParam);
        if (!projectionType) {
            throw new NotFoundException(`Projection type with id ${idParam.id} not found`);
        }
        return projectionType;
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update a projection type" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: ProjectionTypeDetailDto })
    @ApiNotFoundResponse({ description: "Projection type not found" })
    @ApiBody({ type: CreateAndUpdateProjectionTypeDto })
    async update(
        @Param() idParam: IdNumberParamDto,
        @Body() body: CreateAndUpdateProjectionTypeDto
    ) {
        const projectionType = await this.projectionTypeService.update(idParam, body);
        if (!projectionType) {
            throw new NotFoundException(`Projection type with id ${idParam.id} not found`);
        }
        return projectionType;
    }

    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Soft delete a projection type" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: ProjectionTypeDetailDto })
    @ApiNotFoundResponse({ description: "Projection type not found" })
    async delete(@Param() idParam: IdNumberParamDto) {
        const projectionType = await this.projectionTypeService.delete(idParam);
        if (!projectionType) {
            throw new NotFoundException(`Projection type with id ${idParam.id} not found`);
        }
        return projectionType;
    }
}

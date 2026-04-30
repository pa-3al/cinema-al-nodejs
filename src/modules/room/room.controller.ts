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
import { AllRoomDto, CreateAndUpdateRoomDto, RoomDetailDto } from "src/core/domain/cinema/room/dto/room.dto";
import type { IRoomServicePort } from "src/core/domain/cinema/room/port/room-service.port";
import { IdNumberParamDto, PaginationQueryDto } from "src/core/domain/global/dto/global.dto";
import { ROOM_SERVICE } from "src/core/domain/global/token";
import { Room } from "src/infrastructure/adapters/persistence/sql/entities/room.entity";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../core/application/cinema/auth/guards/roles.guard";
import { Roles } from "../../core/application/cinema/auth/decorators/roles.decorator";

@ApiTags('Room')
@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RoomController {
    private readonly logger = new Logger(RoomController.name);

    constructor(
        @Inject(ROOM_SERVICE)
        private readonly roomService: IRoomServicePort
    ) {}

    @Post()
    @ApiOperation({ summary: "Create a new room" })
    @Roles("employee", "super_admin")
    @ApiCreatedResponse({ type: Room })
    @ApiBadRequestResponse({ description: "Bad request - Invalid payload data" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: CreateAndUpdateRoomDto })
    async create(@Body() body: CreateAndUpdateRoomDto) {
        this.logger.log(`Creating new room: ${body.name}`);
        return await this.roomService.create(body);
    }

    @Get()
    @ApiOperation({ summary: "Get all rooms" })
    @ApiOkResponse({ type: AllRoomDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid query parameters" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findAll(@Query() query: PaginationQueryDto) {
        this.logger.log(`Fetching rooms with pagination: page ${query.page}, size ${query.size}`);
        return await this.roomService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: "get room by id" })
    @ApiOkResponse({ type: RoomDetailDto })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: 'Room not found' })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findOne(@Param() id: IdNumberParamDto) {
        this.logger.log(`Fetching room by id: ${id.id}`);
        const room = await this.roomService.findOne(id);
        if (!room) {
            this.logger.warn(`Room with id ${id.id} not found`);
            throw new NotFoundException(`Room with id ${id.id} not found`);
        }
        return room;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a room' })
    @Roles("employee", "super_admin")
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ type: RoomDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid parameters or payload" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: 'room not found' })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: CreateAndUpdateRoomDto })
    async update(
        @Param() idParam: IdNumberParamDto,
        @Body() body: CreateAndUpdateRoomDto
    ) {
        this.logger.log(`Updating room with id: ${idParam.id}`);
        const room = await this.roomService.update(idParam, body);
        if (!room) {
            this.logger.warn(`Failed to update. Room with id ${idParam.id} not found`);
            throw new NotFoundException(`room with id ${idParam.id} not found`);
        }
        return room;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @Roles("employee", "super_admin")
    @ApiOperation({ summary: 'Soft delete a room' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ type: RoomDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: 'room not found' })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async delete(@Param() idParam: IdNumberParamDto) {
        this.logger.log(`Deleting room with id: ${idParam.id}`);
        const room = await this.roomService.delete(idParam);
        if (!room) {
            this.logger.warn(`Failed to delete. Room with id ${idParam.id} not found`);
            throw new NotFoundException(`Room with id ${idParam.id} not found`);
        }
        return room;
    }
}
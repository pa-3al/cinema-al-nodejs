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
    Query, UseGuards
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags
} from "@nestjs/swagger";
import { AllRoomDto, CreateAndUpdateRoomDto, RoomDetailDto } from "src/core/domain/cinema/room/dto/room.dto";
import type { IRoomServicePort } from "src/core/domain/cinema/room/port/room-service.port";
import { IdNumberParamDto, PaginationQueryDto } from "src/core/domain/global/dto/global.dto";
import { ROOM_SERVICE } from "src/core/domain/global/token";
import { Room } from "src/infrastructure/adapters/persistence/sql/entities/room.entity";
import {JwtAuthGuard} from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import {RolesGuard} from "../../core/application/cinema/auth/guards/roles.guard";
import {Roles} from "../../core/application/cinema/auth/decorators/roles.decorator";

@ApiTags('Room')
@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RoomController {
    constructor (
        @Inject(ROOM_SERVICE)
        private readonly roomService : IRoomServicePort
    ){}

    @Post()
    @ApiOperation({summary: "Create a new room"})
    @Roles("employee", "super_admin")
    @ApiCreatedResponse({type : Room})
    @ApiBody({ type : CreateAndUpdateRoomDto})
    async create(@Body() body : CreateAndUpdateRoomDto) {
        return await this.roomService.create(body);
    }

    @Get()
    @ApiOperation({ summary: "Get all rooms"})
    @ApiOkResponse({type : AllRoomDto})
    async findAll(@Query() query : PaginationQueryDto) {
        return await this.roomService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary : "get room by id"})
    @ApiOkResponse({type : RoomDetailDto})
    @ApiParam({name : "id", type : Number, example : 1})
    @ApiNotFoundResponse({description : 'Room not found'})
    async findOne(@Param() id : IdNumberParamDto) {
        const room = await this.roomService.findOne(id);

        if (!room) {
            throw new NotFoundException(`Room with id ${id.id} not found`);
        }
        return room;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a movie genre' })
    @Roles("employee", "super_admin")
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ type: RoomDetailDto })
    @ApiNotFoundResponse({ description: 'room not found' })
    @ApiBody({ type: CreateAndUpdateRoomDto })
    async update(
        @Param() idParam: IdNumberParamDto,
        @Body() body: CreateAndUpdateRoomDto
    ) {
        const room = await this.roomService.update(idParam, body);
        if (!room) {
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
    @ApiNotFoundResponse({ description: 'room not found' })
    async delete(@Param() idParam: IdNumberParamDto) {
        const room = await this.roomService.delete(idParam);
        if (!room) {
            throw new NotFoundException(`Movie genre with id ${idParam.id} not found`);
        }
        return room;
    }
}

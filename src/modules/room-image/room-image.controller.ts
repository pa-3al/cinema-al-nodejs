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
    UploadedFile, UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags
} from "@nestjs/swagger";
import { AllRoomImageDto, CreateAndUpdateRoomImageDto, RoomImageDetailsDto, UploadRoomImageDto } from "src/core/domain/cinema/room-image/dto/room-image.dto";
import type { IRoomImageServicePort } from "src/core/domain/cinema/room-image/port/room-image-service.port";
import { IdNumberParamDto, PaginationQueryDto } from "src/core/domain/global/dto/global.dto";
import { ROOM_IMAGE_SERVICE } from "src/core/domain/global/token";
import {JwtAuthGuard} from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import {RolesGuard} from "../../core/application/cinema/auth/guards/roles.guard";
import {Roles} from "../../core/application/cinema/auth/decorators/roles.decorator";


@ApiTags('Room')
@Controller('room-images')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RoomImageController {
    constructor (
        @Inject(ROOM_IMAGE_SERVICE)
        private readonly roomImageService : IRoomImageServicePort
    ){}

    @Post()
    @ApiOperation({summary: "Create a new roomImage"})
    @Roles("employee", "super_admin")
    @ApiCreatedResponse({type : RoomImageDetailsDto})
    @ApiBody({ type : CreateAndUpdateRoomImageDto})
    @ApiOperation({deprecated: true})
    async create(@Body() body : CreateAndUpdateRoomImageDto) {
        return await this.roomImageService.create(body);
    }

    @Get()
    @ApiOperation({ summary: "Get all room images"})
    @ApiOkResponse({type : AllRoomImageDto})
    async findAll(@Query() query : PaginationQueryDto) {
        return await this.roomImageService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary : "get roomImage by roomid"})
    @ApiOkResponse({type : RoomImageDetailsDto})
    @ApiParam({name : "id", type : Number, example : 1})
    @ApiNotFoundResponse({description : 'Room not found'})
    async findOne(@Param() id : IdNumberParamDto) {
        const roomImage = await this.roomImageService.findOne(id);

        if (!roomImage) {
            throw new NotFoundException(`Room with id ${id.id} not found`);
        }
        return roomImage;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a movie genre' })
    @Roles("employee", "super_admin")
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ type: RoomImageDetailsDto })
    @ApiNotFoundResponse({ description: 'roomImage not found' })
    @ApiBody({ type: CreateAndUpdateRoomImageDto })
    async update(
        @Param() idParam: IdNumberParamDto,
        @Body() body: CreateAndUpdateRoomImageDto
    ) {
        const roomImage = await this.roomImageService.update(idParam, body);
        if (!roomImage) {
            throw new NotFoundException(`roomImage with id ${idParam.id} not found`);
        }
        return roomImage;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @Roles("employee", "super_admin")
    @ApiOperation({ summary: 'Soft delete a roomImage' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ type: RoomImageDetailsDto })
    @ApiNotFoundResponse({ description: 'roomImage not found' })
    async delete(@Param() idParam: IdNumberParamDto) {
        const roomImage = await this.roomImageService.delete(idParam);
        if (!roomImage) {
            throw new NotFoundException(`Movie genre with id ${idParam.id} not found`);
        }
        return roomImage;
    }

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    @ApiConsumes("multipart/form-data")
    async uploadFile(@Body() body: UploadRoomImageDto, @UploadedFile() file: { originalname: string; buffer: Buffer }): Promise<RoomImageDetailsDto> {
        return this.roomImageService.createWithUpload(body, file);
    }
}

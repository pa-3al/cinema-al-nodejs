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
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Logger
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
    ApiTags,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { AllRoomImageDto, CreateAndUpdateRoomImageDto, RoomImageDetailsDto, UploadRoomImageDto } from "src/core/domain/cinema/room-image/dto/room-image.dto";
import type { IRoomImageServicePort } from "src/core/domain/cinema/room-image/port/room-image-service.port";
import { IdNumberParamDto, PaginationQueryDto } from "src/core/domain/global/dto/global.dto";
import { ROOM_IMAGE_SERVICE } from "src/core/domain/global/token";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../core/application/cinema/auth/guards/roles.guard";
import { Roles } from "../../core/application/cinema/auth/decorators/roles.decorator";

@ApiTags('Room')
@Controller('room-images')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RoomImageController {
    private readonly logger = new Logger(RoomImageController.name);

    constructor(
        @Inject(ROOM_IMAGE_SERVICE)
        private readonly roomImageService: IRoomImageServicePort
    ) {}

    @Post()
    @ApiOperation({ summary: "Create a new roomImage", deprecated: true })
    @Roles("employee", "super_admin")
    @ApiCreatedResponse({ type: RoomImageDetailsDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid payload data" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: CreateAndUpdateRoomImageDto })
    async create(@Body() body: CreateAndUpdateRoomImageDto) {
        this.logger.log(`Creating room image (deprecated route) for room ID: ${body.roomId}`);
        return await this.roomImageService.create(body);
    }

    @Get()
    @ApiOperation({ summary: "Get all room images" })
    @ApiOkResponse({ type: AllRoomImageDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid query parameters" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findAll(@Query() query: PaginationQueryDto) {
        this.logger.log(`Fetching room images with pagination: page ${query.page}, size ${query.size}`);
        return await this.roomImageService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: "get roomImage by id" })
    @ApiOkResponse({ type: RoomImageDetailsDto })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: 'Room image not found' })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findOne(@Param() id: IdNumberParamDto) {
        this.logger.log(`Fetching room image by id: ${id.id}`);
        const roomImage = await this.roomImageService.findOne(id);
        if (!roomImage) {
            this.logger.warn(`Room image with id ${id.id} not found`);
            throw new NotFoundException(`Room image with id ${id.id} not found`);
        }
        return roomImage;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a room image' })
    @Roles("employee", "super_admin")
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ type: RoomImageDetailsDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid parameters or payload" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: 'roomImage not found' })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: CreateAndUpdateRoomImageDto })
    async update(
        @Param() idParam: IdNumberParamDto,
        @Body() body: CreateAndUpdateRoomImageDto
    ) {
        this.logger.log(`Updating room image with id: ${idParam.id}`);
        const roomImage = await this.roomImageService.update(idParam, body);
        if (!roomImage) {
            this.logger.warn(`Failed to update. Room image with id ${idParam.id} not found`);
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
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: 'roomImage not found' })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async delete(@Param() idParam: IdNumberParamDto) {
        this.logger.log(`Deleting room image with id: ${idParam.id}`);
        const roomImage = await this.roomImageService.delete(idParam);
        if (!roomImage) {
            this.logger.warn(`Failed to delete. Room image with id ${idParam.id} not found`);
            throw new NotFoundException(`Room image with id ${idParam.id} not found`);
        }
        return roomImage;
    }

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    @ApiConsumes("multipart/form-data")
    @ApiOperation({ summary: "Upload and create a new room image" })
    @ApiCreatedResponse({ type: RoomImageDetailsDto })
    @ApiBadRequestResponse({ description: "Bad request - Missing file or invalid payload" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async uploadFile(
        @Body() body: UploadRoomImageDto,
        @UploadedFile() file: { originalname: string; buffer: Buffer }
    ): Promise<RoomImageDetailsDto> {
        this.logger.log(`Uploading new room image for room ID: ${body.roomId}`);
        return this.roomImageService.createWithUpload(body, file);
    }
}
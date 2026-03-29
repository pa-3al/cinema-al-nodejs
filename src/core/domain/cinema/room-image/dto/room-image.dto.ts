import { ApiProperty } from '@nestjs/swagger';

export class RoomImageDetailsDto {

    @ApiProperty({ description: "Unique identifier of the room image", example: 1 })
    id : number;

    @ApiProperty({ description: "URL of the room image", example: "https://example.com/room-image.jpg" })
    imageUrl : string;

    @ApiProperty({ description: "Display order of the room image", example: 1 })
    displayOrder : number;

    @ApiProperty({ description: "Identifier of the associated room", example: 1 })
    roomId : number;

    @ApiProperty({ description: "Date of creation" })
    createdAt : Date;

    @ApiProperty({ description: "Date of last update" })
    updatedAt : Date;

    @ApiProperty({ description: "Date of deletion" })
    deletedAt : Date | null;
}

export class AllRoomImageDto {
    @ApiProperty({ description: "List of room images on this page", type: [RoomImageDetailsDto] })
    data : RoomImageDetailsDto[];

    @ApiProperty({ description: "Current page number", example: 1 })
    page : number;

    @ApiProperty({ description: "Number of items per page", example: 10 })
    size : number;

    @ApiProperty({ description: "Total number of items", example: 100 })
    totalCount : number;

    @ApiProperty({ description: "Total number of pages", example: 10 })
    totalPage : number;
}

export class CreateAndUpdateRoomImageDto {
    @ApiProperty({ description: "URL of the room image", example: "https://example.com/room-image.jpg" })
    imageUrl : string;

    @ApiProperty({ description: "Display order of the room image", example: 1 })
    displayOrder : number;

    @ApiProperty({ description: "Identifier of the associated room", example: 1 })
    roomId : number;
}

export class UploadRoomImageDto {

    @ApiProperty({ description: "Identifier of the associated room", example: 1 })
    roomId : number;

    @ApiProperty({ description: "Display order of the room image", example: 1 })
    displayOrder : number;
}

import { ApiProperty } from "@nestjs/swagger";
import {IsInt, Max, Min} from "class-validator";
import {Type} from "class-transformer";

export class RoomDetailDto {

    @ApiProperty({ description : "Unique identifier of the room", example: 1 })
    id : number;

    @ApiProperty({ description : "Name of the room", example: "Absolute room" })
    name : string;

    @ApiProperty({ description : "Description of the room", example: "An absolute room" })
    description : string;

    @ApiProperty({ description : "Capacity of the room", example: 50 })
    capacity : number;

    @ApiProperty({ description : "Indicates if the room is under maintenance", example: false })
    isMaintenance : boolean;

    @ApiProperty({ description : "List of image IDs associated with this room", type: [Number], example: [1, 2, 3], required: false })
    roomImageIds? : number[];

    @ApiProperty({ description: "Projection type identifier", example: 1 })
    projectionTypeId: number;

    @ApiProperty({ description : "Date of creation" })
    createdAt : Date;

    @ApiProperty({ description : "Date of last update" })
    updatedAt : Date;

    @ApiProperty({ description : "Date of deletion" })
    deletedAt : Date | null;
}

export class AllRoomDto {

    @ApiProperty( {description : "List of rooms on this page", type: [RoomDetailDto]})
    data : RoomDetailDto[];

    @ApiProperty( {description : "Current page number", example: 1})
    page : number;

    @ApiProperty( {description : "Number of items per page", example: 10})
    size : number;

    @ApiProperty( {description : "Total number of items", example: 100})
    totalCount : number;

    @ApiProperty( {description : "Total number of pages", example: 10})
    totalPage : number;
}

export class CreateAndUpdateRoomDto {

    @ApiProperty({ description : "Name of the room", example: "Absolute room" })
    name : string;

    @ApiProperty({ description : "Description of the room", example: "An absolute room" })
    description : string;

    @ApiProperty({ description : "Capacity of the room", example: 50 })
    @Min(15)
    @Max(30)
    capacity : number;

    @ApiProperty({ description : "Indicates if the room is under maintenance", example: false })
    isMaintenance : boolean;

    @ApiProperty({ description: "Projection type identifier", example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    projectionTypeId: number;
}

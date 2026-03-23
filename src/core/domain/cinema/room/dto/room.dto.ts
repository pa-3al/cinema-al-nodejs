import { ApiProperty } from "@nestjs/swagger";

export class RoomDetailDto {

    @ApiProperty({ description : "Unique identifier of the room", example: 1 })
    id : number;

    @ApiProperty({ description : "Name of the room", example: "Room 1" })
    name : string;

    @ApiProperty({ description : "Description of the room", example: "A cozy room with comfortable seating" })
    description : string;

    @ApiProperty({ description : "Capacity of the room", example: 50 })
    capacity : number;

    @ApiProperty({ description : "Indicates if the room is under maintenance", example: false })
    isMaintenance : boolean;

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

    @ApiProperty({ description : "Name of the room", example: "Room 1" })
    name : string;

    @ApiProperty({ description : "Description of the room", example: "A cozy room with comfortable seating" })
    description : string;

    @ApiProperty({ description : "Capacity of the room", example: 50 })
    capacity : number;

    @ApiProperty({ description : "Indicates if the room is under maintenance", example: false })
    isMaintenance : boolean;
}

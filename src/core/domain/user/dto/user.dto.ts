import { ApiProperty } from "@nestjs/swagger";

export class UserDetailDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstname: string;

    @ApiProperty()
    lastname: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    balance: number;

    @ApiProperty()
    createdAt: Date;
}

export class AllUsersDto {
    @ApiProperty({ type: [UserDetailDto] })
    data: UserDetailDto[];

    @ApiProperty()
    page: number;

    @ApiProperty()
    size: number;

    @ApiProperty()
    totalCount: number;

    @ApiProperty()
    totalPage: number;
}
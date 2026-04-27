import { ApiProperty } from "@nestjs/swagger";

export class UserDetailDto {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Unique identifier of the user"
    })
    id: string;

    @ApiProperty({
        example: "remy.machavoine@email.com",
        description: "User's email address"
    })
    email: string;

    @ApiProperty({
        example: "Rémy",
        description: "User's first name"
    })
    firstname: string;

    @ApiProperty({
        example: "Machavoine",
        description: "User's last name"
    })
    lastname: string;

    @ApiProperty({
        example: "user",
        enum: ['user', 'employee', 'super_admin'],
        description: "Role assigned to the user (defines permissions and access level)"
    })
    role: string;

    @ApiProperty({
        example: 150.50,
        description: "Current account balance of the user"
    })
    balance: number;

    @ApiProperty({
        example: "2026-04-28T12:00:00Z",
        description: "Date and time when the user account was created"
    })
    createdAt: Date;
}

export class AllUsersDto {
    @ApiProperty({
        type: [UserDetailDto],
        description: "List of users for the current page"
    })
    data: UserDetailDto[];

    @ApiProperty({
        example: 1,
        description: "Current page number"
    })
    page: number;

    @ApiProperty({
        example: 10,
        description: "Number of users per page"
    })
    size: number;

    @ApiProperty({
        example: 100,
        description: "Total number of users"
    })
    totalCount: number;

    @ApiProperty({
        example: 10,
        description: "Total number of pages available"
    })
    totalPage: number;
}
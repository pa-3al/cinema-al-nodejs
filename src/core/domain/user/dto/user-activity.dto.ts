import { ApiProperty } from "@nestjs/swagger";

export class UserActivityDto {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    balance: number;

    @ApiProperty({ description: "Nombre total de billets achetés" })
    ticketsBought: number;

    @ApiProperty({ description: "Argent total dépensé dans le cinéma" })
    totalSpent: number;

    @ApiProperty({ description: "Liste des films vus", type: [String] })
    moviesSeen: string[];
}
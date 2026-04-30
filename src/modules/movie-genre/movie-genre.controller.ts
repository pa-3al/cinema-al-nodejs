import {
    Body,
    Controller,
    Get,
    Inject,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
    Logger
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiParam,
    ApiBody,
    ApiBearerAuth,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { MOVIE_GENRE_SERVICE } from "../../core/domain/global/token";
import * as movieGenreServicePort from "../../core/domain/cinema/movie-genre/port/movie-genre-service.port";
import { IdNumberParamDto, PaginationQueryDto } from "../../core/domain/global/dto/global.dto";
import {
    CreateAndUpdateMovieGenreDto,
    MovieGenreDetailDto,
    AllMovieGenreDto
} from "../../core/domain/cinema/movie-genre/dto/movie-genre.dto";
import { JwtAuthGuard } from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../core/application/cinema/auth/guards/roles.guard";
import { Roles } from "../../core/application/cinema/auth/decorators/roles.decorator";

@ApiTags('Movie Genres')
@Controller("movie-genres")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MovieGenreController {
    private readonly logger = new Logger(MovieGenreController.name);

    constructor(
        @Inject(MOVIE_GENRE_SERVICE)
        private readonly movieGenreService: movieGenreServicePort.IMovieGenreServicePort
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new movie genre' })
    @Roles("employee", "super_admin")
    @ApiCreatedResponse({ type: MovieGenreDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid payload data" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: CreateAndUpdateMovieGenreDto })
    async create(@Body() body: CreateAndUpdateMovieGenreDto) {
        this.logger.log(`Creating new movie genre: ${body.name}`);
        return await this.movieGenreService.create(body);
    }

    @Get()
    @ApiOperation({ summary: 'Get all movie genres with pagination' })
    @ApiOkResponse({ type: AllMovieGenreDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid query parameters" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findAll(@Query() query: PaginationQueryDto) {
        this.logger.log(`Fetching movie genres with pagination: page ${query.page}, size ${query.size}`);
        return await this.movieGenreService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a movie genre by id' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ type: MovieGenreDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: 'Genre not found' })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findOne(@Param() idParam: IdNumberParamDto) {
        this.logger.log(`Fetching movie genre by id: ${idParam.id}`);
        const movieGenre = await this.movieGenreService.findOnd(idParam);
        if (!movieGenre) {
            this.logger.warn(`Movie genre with id ${idParam.id} not found`);
            throw new NotFoundException(`Movie genre with id ${idParam.id} not found`);
        }
        return movieGenre;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a movie genre' })
    @Roles("employee", "super_admin")
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ type: MovieGenreDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid parameters or payload" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: 'Genre not found' })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: CreateAndUpdateMovieGenreDto })
    async update(
        @Param() idParam: IdNumberParamDto,
        @Body() body: CreateAndUpdateMovieGenreDto
    ) {
        this.logger.log(`Updating movie genre with id: ${idParam.id}`);
        const movieGenre = await this.movieGenreService.update(idParam, body);
        if (!movieGenre) {
            this.logger.warn(`Failed to update. Movie genre with id ${idParam.id} not found`);
            throw new NotFoundException(`Movie genre with id ${idParam.id} not found`);
        }
        return movieGenre;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @Roles("employee", "super_admin")
    @ApiOperation({ summary: 'Soft delete a movie genre' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ type: MovieGenreDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: 'Genre not found' })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async delete(@Param() idParam: IdNumberParamDto) {
        this.logger.log(`Deleting movie genre with id: ${idParam.id}`);
        const movieGenre = await this.movieGenreService.delete(idParam);
        if (!movieGenre) {
            this.logger.warn(`Failed to delete. Movie genre with id ${idParam.id} not found`);
            throw new NotFoundException(`Movie genre with id ${idParam.id} not found`);
        }
        return movieGenre;
    }
}
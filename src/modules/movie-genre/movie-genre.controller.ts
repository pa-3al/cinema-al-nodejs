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
    HttpStatus, UseGuards
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiParam,
    ApiBody, ApiBearerAuth
} from "@nestjs/swagger";
import { MOVIE_GENRE_SERVICE } from "../../core/domain/global/token";
import * as movieGenreServicePort from "../../core/domain/cinema/movie-genre/port/movie-genre-service.port";
import { IdNumberParamDto, PaginationQueryDto } from "../../core/domain/global/dto/global.dto";
import {
    CreateAndUpdateMovieGenreDto,
    MovieGenreDetailDto,
    AllMovieGenreDto
} from "../../core/domain/cinema/movie-genre/dto/movie-genre.dto";
import {JwtAuthGuard} from "../../core/application/cinema/auth/guards/jwt-auth.guard";
import {RolesGuard} from "../../core/application/cinema/auth/guards/roles.guard";
import {Roles} from "../../core/application/cinema/auth/decorators/roles.decorator";

@ApiTags('Movie Genres')
@Controller("movie-genres")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MovieGenreController {
    constructor(
        @Inject(MOVIE_GENRE_SERVICE)
        private readonly movieGenreService: movieGenreServicePort.IMovieGenreServicePort
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new movie genre' })
    @Roles("employee", "super_admin")
    @ApiCreatedResponse({ type: MovieGenreDetailDto })
    @ApiBody({ type: CreateAndUpdateMovieGenreDto })
    async create(@Body() body: CreateAndUpdateMovieGenreDto) {
        return await this.movieGenreService.create(body);
    }

    @Get()
    @ApiOperation({ summary: 'Get all movie genres with pagination' })
    @ApiOkResponse({ type: AllMovieGenreDto })
    async findAll(@Query() query: PaginationQueryDto) {
        return await this.movieGenreService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a movie genre by id' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ type: MovieGenreDetailDto })
    @ApiNotFoundResponse({ description: 'Genre not found' })
    async findOne(@Param() idParam: IdNumberParamDto) {
        const movieGenre = await this.movieGenreService.findOnd(idParam);
        if (!movieGenre) {
            throw new NotFoundException(`Movie genre with id ${idParam.id} not found`);
        }
        return movieGenre;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a movie genre' })
    @Roles("employee", "super_admin")
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ type: MovieGenreDetailDto })
    @ApiNotFoundResponse({ description: 'Genre not found' })
    @ApiBody({ type: CreateAndUpdateMovieGenreDto })
    async update(
        @Param() idParam: IdNumberParamDto,
        @Body() body: CreateAndUpdateMovieGenreDto
    ) {
        const movieGenre = await this.movieGenreService.update(idParam, body);
        if (!movieGenre) {
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
    @ApiNotFoundResponse({ description: 'Genre not found' })
    async delete(@Param() idParam: IdNumberParamDto) {
        const movieGenre = await this.movieGenreService.delete(idParam);
        if (!movieGenre) {
            throw new NotFoundException(`Movie genre with id ${idParam.id} not found`);
        }
        return movieGenre;
    }
}
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
    Query, UploadedFile,
    UseGuards, UseInterceptors
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiBody, ApiConsumes,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/core/application/cinema/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/core/application/cinema/auth/guards/roles.guard";
import { Roles } from "src/core/application/cinema/auth/decorators/roles.decorator";
import { AllMovieDto, CreateAndUpdateMovieDto, MovieDetailDto, MoviePlanningDto, MoviePlanningQueryDto } from "src/core/domain/cinema/movie/dto/movie.dto";
import type { IMovieServicePort } from "src/core/domain/cinema/movie/port/movie-service.port";
import { IdNumberParamDto, PaginationQueryDto } from "src/core/domain/global/dto/global.dto";
import { MOVIE_SERVICE } from "src/core/domain/global/token";
import {FileInterceptor} from "@nestjs/platform-express";

@ApiTags("Movies")
@Controller("movies")
export class MovieController {

    constructor(
        @Inject(MOVIE_SERVICE)
        private readonly movieService: IMovieServicePort
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("employee", "super_admin")
    @UseInterceptors(FileInterceptor('poster'))
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a movie (employee or super_admin only)" })
    @ApiCreatedResponse({ type: MovieDetailDto })
    @ApiBody({ type: CreateAndUpdateMovieDto })
    async create(
        @Body() body: CreateAndUpdateMovieDto,
        @UploadedFile() file?: { originalname: string; buffer: Buffer }
    ) {
        return await this.movieService.create(body, file);
    }

    @Get()
    @ApiOperation({ summary: "Get all movies" })
    @ApiOkResponse({ type: AllMovieDto })
    async findAll(@Query() query: PaginationQueryDto) {
        return await this.movieService.findAll(query);
    }

    @Get(":id/planning/upcoming-month")
    @ApiOperation({ summary: "Get upcoming month planning for one movie" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ description: "Movie planning", type: MoviePlanningDto })
    @ApiNotFoundResponse({ description: "Movie not found" })
    async getPlanningForUpcomingMonth(
        @Param() idParam: IdNumberParamDto,
        @Query() query: MoviePlanningQueryDto
    ): Promise<MoviePlanningDto> {
        const planning = await this.movieService.getPlanningForNextMonth(idParam, query);

        if (!planning) {
            throw new NotFoundException(`Movie with id ${idParam.id} not found`);
        }

        return planning;
    }

    @Get(":id")
    @ApiOperation({ summary: "Get movie by id" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: MovieDetailDto })
    @ApiNotFoundResponse({ description: "Movie not found" })
    async findOne(@Param() idParam: IdNumberParamDto) {
        const movie = await this.movieService.findOne(idParam);

        if (!movie) {
            throw new NotFoundException(`Movie with id ${idParam.id} not found`);
        }

        return movie;
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("employee", "super_admin")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update a movie (employee or super_admin only)" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: MovieDetailDto })
    @ApiNotFoundResponse({ description: "Movie not found" })
    @ApiBody({ type: CreateAndUpdateMovieDto })
    async update(
        @Param() idParam: IdNumberParamDto,
        @Body() body: CreateAndUpdateMovieDto,
        @UploadedFile() file?: { originalname: string; buffer: Buffer }
    ) {
        const movie = await this.movieService.update(idParam, body, file);

        if (!movie) {
            throw new NotFoundException(`Movie with id ${idParam.id} not found`);
        }

        return movie;
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("employee", "super_admin")
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Delete a movie (employee or super_admin only)" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: MovieDetailDto })
    @ApiNotFoundResponse({ description: "Movie not found" })
    async delete(@Param() idParam: IdNumberParamDto) {
        const movie = await this.movieService.delete(idParam);

        if (!movie) {
            throw new NotFoundException(`Movie with id ${idParam.id} not found`);
        }

        return movie;
    }
}

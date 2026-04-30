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
import { JwtAuthGuard } from "src/core/application/cinema/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/core/application/cinema/auth/guards/roles.guard";
import { Roles } from "src/core/application/cinema/auth/decorators/roles.decorator";
import { AllMovieDto, CreateAndUpdateMovieDto, MovieDetailDto, MoviePlanningDto, MoviePlanningQueryDto } from "src/core/domain/cinema/movie/dto/movie.dto";
import type { IMovieServicePort } from "src/core/domain/cinema/movie/port/movie-service.port";
import { IdNumberParamDto, PaginationQueryDto } from "src/core/domain/global/dto/global.dto";
import { MOVIE_SERVICE } from "src/core/domain/global/token";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Movies")
@Controller("movies")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MovieController {
    private readonly logger = new Logger(MovieController.name);

    constructor(
        @Inject(MOVIE_SERVICE)
        private readonly movieService: IMovieServicePort
    ) {}

    @Post()
    @Roles("employee", "super_admin")
    @UseInterceptors(FileInterceptor('poster'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: "Create a movie (employee or super_admin only)" })
    @ApiCreatedResponse({ type: MovieDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid payload data" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: CreateAndUpdateMovieDto })
    async create(
        @Body() body: CreateAndUpdateMovieDto,
        @UploadedFile() file?: { originalname: string; buffer: Buffer }
    ) {
        this.logger.log(`Creating new movie: ${body.title}`);
        return await this.movieService.create(body, file);
    }

    @Get()
    @ApiOperation({ summary: "Get all movies" })
    @ApiOkResponse({ type: AllMovieDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid query parameters" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findAll(@Query() query: PaginationQueryDto) {
        this.logger.log(`Fetching all movies with pagination: page ${query.page}, size ${query.size}`);
        return await this.movieService.findAll(query);
    }

    @Get(":id/planning/upcoming-month")
    @ApiOperation({ summary: "Get upcoming month planning for one movie" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ description: "Movie planning", type: MoviePlanningDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID or query params" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: "Movie not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async getPlanningForUpcomingMonth(
        @Param() idParam: IdNumberParamDto,
        @Query() query: MoviePlanningQueryDto
    ): Promise<MoviePlanningDto> {
        this.logger.log(`Fetching upcoming month planning for movie id: ${idParam.id}`);
        const planning = await this.movieService.getPlanningForNextMonth(idParam, query);
        if (!planning) {
            this.logger.warn(`Movie with id ${idParam.id} not found for planning`);
            throw new NotFoundException(`Movie with id ${idParam.id} not found`);
        }
        return planning;
    }

    @Get(":id")
    @ApiOperation({ summary: "Get movie by id" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: MovieDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: "Movie not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async findOne(@Param() idParam: IdNumberParamDto) {
        this.logger.log(`Fetching movie by id: ${idParam.id}`);
        const movie = await this.movieService.findOne(idParam);
        if (!movie) {
            this.logger.warn(`Movie with id ${idParam.id} not found`);
            throw new NotFoundException(`Movie with id ${idParam.id} not found`);
        }
        return movie;
    }

    @Patch(":id")
    @Roles("employee", "super_admin")
    @ApiOperation({ summary: "Update a movie (employee or super_admin only)" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: MovieDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid parameters or payload" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Movie not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @ApiBody({ type: CreateAndUpdateMovieDto })
    async update(
        @Param() idParam: IdNumberParamDto,
        @Body() body: CreateAndUpdateMovieDto,
        @UploadedFile() file?: { originalname: string; buffer: Buffer }
    ) {
        this.logger.log(`Updating movie with id: ${idParam.id}`);
        const movie = await this.movieService.update(idParam, body, file);
        if (!movie) {
            this.logger.warn(`Failed to update. Movie with id ${idParam.id} not found`);
            throw new NotFoundException(`Movie with id ${idParam.id} not found`);
        }
        return movie;
    }

    @Delete(":id")
    @Roles("employee", "super_admin")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Delete a movie (employee or super_admin only)" })
    @ApiParam({ name: "id", type: Number, example: 1 })
    @ApiOkResponse({ type: MovieDetailDto })
    @ApiBadRequestResponse({ description: "Bad request - Invalid ID parameter" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden resource" })
    @ApiNotFoundResponse({ description: "Movie not found" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    async delete(@Param() idParam: IdNumberParamDto) {
        this.logger.log(`Deleting movie with id: ${idParam.id}`);
        const movie = await this.movieService.delete(idParam);
        if (!movie) {
            this.logger.warn(`Failed to delete. Movie with id ${idParam.id} not found`);
            throw new NotFoundException(`Movie with id ${idParam.id} not found`);
        }
        return movie;
    }
}
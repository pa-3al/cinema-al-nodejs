import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Query,
    UseGuards
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/core/application/cinema/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/core/application/cinema/auth/guards/roles.guard";
import { Roles } from "src/core/application/cinema/auth/decorators/roles.decorator";
import { AllScreeningDto, CreateScreeningDto, ScreeningDetailDto, ScreeningQueryDto } from "src/core/domain/cinema/screening/dto/screening.dto";
import type { IScreeningServicePort } from "src/core/domain/cinema/screening/port/screening-service.port";
import { SCREENING_SERVICE } from "src/core/domain/global/token";

@ApiTags("Screenings")
@Controller("screenings")
export class ScreeningController {

    constructor(
        @Inject(SCREENING_SERVICE)
        private readonly screeningService: IScreeningServicePort
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("employee", "super_admin")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create a screening (employee or super_admin only)" })
    @ApiCreatedResponse({ type: ScreeningDetailDto })
    @ApiBody({ type: CreateScreeningDto })
    async create(@Body() body: CreateScreeningDto) {
        return await this.screeningService.create(body);
    }

    @Get()
    @ApiOperation({ summary: "Get screenings with optional filters" })
    @ApiOkResponse({ type: AllScreeningDto })
    async findAll(@Query() query: ScreeningQueryDto) {
        return await this.screeningService.findAll(query);
    }
}

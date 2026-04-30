import { Controller, Get, Inject, Res, Logger } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import express from "express";
import { PROMETHEUS_SERVICE } from "../../core/domain/global/token";
import * as prometheusServicePort from "../../core/domain/global/monitoring/prometheus-service.port";

@ApiTags("Prometheus")
@Controller("metrics")
export class PrometheusController {
  private readonly logger = new Logger(PrometheusController.name);

  constructor(
      @Inject(PROMETHEUS_SERVICE)
      private readonly prometheusService: prometheusServicePort.IPrometheusService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get Prometheus metrics" })
  @ApiOkResponse({ description: "Successfully retrieved Prometheus metrics in text format" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  async getMetrics(@Res() res: express.Response) {
    this.logger.log("Fetching Prometheus metrics for monitoring");
    const metrics = await this.prometheusService.getMetrics();
    res.setHeader("Content-Type", "text/plain");
    res.send(metrics);
  }
}
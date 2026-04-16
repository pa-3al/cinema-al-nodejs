import { Controller, Get, Inject, Res } from "@nestjs/common";
import express from "express";
import { PROMETHEUS_SERVICE } from "../../core/domain/global/token";
import * as prometheusServicePort from "../../core/domain/global/monitoring/prometheus-service.port";

@Controller("metrics")
export class PrometheusController {
  constructor(
    @Inject(PROMETHEUS_SERVICE)
    private readonly prometheusService: prometheusServicePort.IPrometheusService,
  ) {}

  @Get()
  async getMetrics(@Res() res: express.Response) {
    const metrics = await this.prometheusService.getMetrics();
    res.setHeader("Content-Type", "text/plain");
    res.send(metrics);
  }
}

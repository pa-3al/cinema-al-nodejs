import { Module } from "@nestjs/common";
import { PROMETHEUS_SERVICE } from "src/core/domain/global/token";
import { PrometheusController } from "./monitoring.controller";
import { PrometheusService } from "../../infrastructure/adapters/monitoring/prometheus.service";

@Module({
  imports: [],
  controllers: [PrometheusController],
  providers: [{ provide: PROMETHEUS_SERVICE, useClass: PrometheusService }],
  exports: [PROMETHEUS_SERVICE],
})
export class MonitoringModule {}

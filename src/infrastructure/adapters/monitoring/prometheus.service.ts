import { Inject, Injectable } from "@nestjs/common";
import * as client from "prom-client";
import { SECRET_PORT } from "../../../core/domain/global/token";
import * as secretManagerInterface from "../../../core/domain/global/config/port/secret-manager.port";
import { IPrometheusService } from "../../../core/domain/global/monitoring/prometheus-service.port";

@Injectable()
export class PrometheusService implements IPrometheusService {
  private readonly register: client.Registry;

  constructor(
    @Inject(SECRET_PORT)
    private readonly secrets: secretManagerInterface.ISecretManager,
  ) {
    this.register = new client.Registry();
    this.register.setDefaultLabels({ app: secrets.get("NESTJS_APP") });
    client.collectDefaultMetrics({ register: this.register });
  }

  getMetrics(): Promise<string> {
    return this.register.metrics();
  }
}

import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";

@Controller()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  // Liveness: is the process itself still running? No external dependencies
  // checked, so a hung DB connection doesn't trigger a pointless restart.
  @Get("livez")
  @HealthCheck()
  live() {
    return this.health.check([]);
  }

  // Readiness: can this pod actually serve traffic? Checks the DB connection
  // so Kubernetes stops routing to a pod that can't reach Postgres.
  @Get("readyz")
  @HealthCheck()
  ready() {
    return this.health.check([() => this.db.pingCheck("database")]);
  }
}

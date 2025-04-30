import { Router } from "express";

import TelemetryController from "@/modules/telemetry/telemetry.controller";
import DashboardController from "@/modules/dashboard/dashboard.controller";

const router = Router();

const apiRouter = Router();
apiRouter.get("/", TelemetryController.health);
apiRouter.get("/tariff", DashboardController.getTariffs);
apiRouter.get(
  "/consumption/monthly",
  DashboardController.getMonthlyConsumption
);

router.use("/api", apiRouter);
export default router;

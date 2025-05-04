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
apiRouter.get(
  "/consumption/monthly/forecast",
  DashboardController.getMonthlyForecast
);
apiRouter.get(
  "/consumption/monthly/history",
  DashboardController.getLast6MonthsHistory
);
apiRouter.get(
  "/consumption/last-hour/history",
  DashboardController.getLastHourHistory
);
apiRouter.get(
  "/consumption/last-day/history",
  DashboardController.getLastDayHistory
);
apiRouter.get(
  "/consumption/last-month/history",
  DashboardController.getLastMonthHistory
);

router.use("/api", apiRouter);
export default router;

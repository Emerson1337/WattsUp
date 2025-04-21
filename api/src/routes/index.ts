import { Router } from "express";

import TelemetryController from "@/modules/telemetry/telemetry.controller";

const router = Router();

const telemetryController = new TelemetryController();

const apiRouter = Router();
apiRouter.get("/", telemetryController.health);

router.use("/api", apiRouter);
export default router;

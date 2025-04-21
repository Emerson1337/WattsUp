import { Router } from "express";

import TelemetryController from "@/modules/telemetry/telemetry.controller";

const router = Router();

const apiRouter = Router();
apiRouter.get("/", TelemetryController.health);

router.use("/api", apiRouter);
export default router;

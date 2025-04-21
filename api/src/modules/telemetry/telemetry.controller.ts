import { Request, Response } from "express";
import { TelemetryService } from "@/modules/telemetry/telemetry.service";

export default class TelemetryController {
  health = async (request: Request, response: Response): Promise<void> => {
    try {
      const {} = request.params;

      const data = await new TelemetryService().healthCheck();
      response.json(data).status(200);
    } catch (error) {
      response.status(500).json(error);
    }
  };
}

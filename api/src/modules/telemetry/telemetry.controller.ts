import { Request, Response } from "express";
import TelemetryService from "@/modules/telemetry/telemetry.service";
import { WebSocket } from "ws";
import { isTelemetryMessage } from "./types/index";

class TelemetryController {
  health = async (_: Request, response: Response): Promise<void> => {
    try {
      const data = await TelemetryService.healthCheck();
      response.json(data).status(200);
    } catch (error) {
      response.status(500).json(error);
    }
  };

  handleTelemetryConnection(ws: WebSocket): void {
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (!isTelemetryMessage(data)) return;

        TelemetryService.handlePowerData(data);
      } catch (error) {
        console.error("[TELEMETRY] Error processing message:", error);
      }
    });

    ws.on("close", () => {
      console.log("[TELEMETRY] Connection closed. 🛰️");
    });
  }
}

export default new TelemetryController();

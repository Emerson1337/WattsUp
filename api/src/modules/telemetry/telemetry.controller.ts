import { Request, Response } from "express";
import TelemetryService from "@/modules/telemetry/telemetry.service";
import { WebSocket } from "ws";
import { isTelemetryMessage } from "@/modules/telemetry/types";
import { clients } from "@/server";

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

        clients.forEach((client) => {
          this.handleWebAppConnection(ws, { data, clientId: client.clientId });
        });
      } catch (error) {
        console.error("[TELEMETRY] Error processing message:", error);
      }
    });

    ws.on("close", () => {
      console.log("[TELEMETRY] Connection closed. 🛰️");
    });
  }

  handleWebAppConnection(
    ws: WebSocket,
    { data, clientId }: { data: unknown; clientId?: string }
  ): void {
    if (clientId === "webapp") {
      ws.send(JSON.stringify(data));
    }
  }
}

export default new TelemetryController();

import { wssTelemetry } from "@/server";
import TelemetryService from "@/modules/telemetry/telemetry.service";
import TelemetryController from "@/modules/telemetry/telemetry.controller";

wssTelemetry.on("connection", (ws, req) => {
  const token = req.headers["sec-websocket-protocol"];

  if (!token || !TelemetryService.handShake(token)) {
    console.log("[TELEMETRY] Invalid token, closing connection. 🛰️");
    ws.close(1008, "Invalid token");
    return;
  }

  TelemetryController.handleTelemetryConnection(ws);

  console.log("[TELEMETRY] Handshake successful. 🔓");
});

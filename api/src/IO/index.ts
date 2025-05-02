import { wssTelemetry } from "@/server";
import TelemetryService from "@/modules/telemetry/telemetry.service";
import TelemetryController from "@/modules/telemetry/telemetry.controller";
import { clients } from "@/server";

wssTelemetry.on("connection", (ws, req) => {
  const [token, clientId] =
    req.headers["sec-websocket-protocol"]?.split(", ") ?? [];

  if (!token || !TelemetryService.handShake(token)) {
    console.log("[TELEMETRY] Invalid token, closing connection. 🛰️");
    ws.close(1008, "Invalid token");
    return;
  }

  clients.push({ ws, clientId });

  TelemetryController.handleTelemetryConnection(ws);

  console.log("[TELEMETRY] Handshake successful. 🔓");
});

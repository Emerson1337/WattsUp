import app from "@/app";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import "dotenv/config";

const server = http.createServer(app);

export const clients: { ws: WebSocket; clientId?: string }[] = [];

export const wssTelemetry = new WebSocketServer({
  server,
  path: "/telemetry",
  clientTracking: true,
});

import "@/IO";

server.listen(process.env.PORT || 3000, () =>
  console.log("Server has been initializated! 🚀 ")
);

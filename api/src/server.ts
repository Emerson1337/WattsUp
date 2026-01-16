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

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

server.listen(PORT, HOST, () => {
  console.log(`Server has been initializated! 🚀`);
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

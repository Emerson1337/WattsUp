import { ApiPaths } from "@/lib/apiUrls";
import {
  Tariff,
  MonthlyReport,
  MonthlyReportForecast,
  TelemetryMessage,
} from "@/services/types";

export async function getTariff(): Promise<Tariff | undefined> {
  try {
    console.log("🟢🟢🟢🟢 loop");

    const res = await fetch("/api/tariff");

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function getMonthlyReport(): Promise<MonthlyReport | undefined> {
  try {
    const res = await fetch("/api/monthly-report");

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function getMonthlyReportForecast(): Promise<
  MonthlyReportForecast | undefined
> {
  try {
    const res = await fetch("/api/monthly-report-forecast");

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export function openWSConnetionInstantConsumption(): WebSocket {
  const clientId = "webapp";
  const socket = new WebSocket(ApiPaths.websocket.telemetry(), [
    "esp32-iot-key",
    clientId,
  ]);

  return socket;
}

export function listenToSocket(
  ws: WebSocket,
  onMessage: (data: TelemetryMessage) => void,
  onError?: (error: Event) => void
): void {
  ws.onmessage = (event) => {
    try {
      const data: TelemetryMessage = JSON.parse(event.data);

      onMessage(data);
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  ws.onerror = (event) => {
    console.error("WebSocket error:", event);
    if (onError) onError(event);
  };
}

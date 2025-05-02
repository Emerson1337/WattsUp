import { ApiPaths } from "@/lib/apiUrls";
import {
  Tariff,
  MonthlyReport,
  MonthlyReportForecast,
  TelemetryMessage,
  LastSixMonthsHistory,
  LastHourHistory,
} from "@/services/types";

export async function getTariff(): Promise<Tariff | undefined> {
  try {
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

export async function getLastSixMonthsReport(): Promise<
  LastSixMonthsHistory | undefined
> {
  try {
    const res = await fetch("/api/consumption-monthly-history");

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function getLastHourPerMinute(): Promise<
  LastHourHistory | undefined
> {
  try {
    const res = await fetch("/api/consumption-per-minute-history");

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

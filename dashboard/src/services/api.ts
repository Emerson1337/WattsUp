import { NextApiPaths, ApiPaths } from "@/lib/apiUrls";
import {
  Tariff,
  MonthlyReport,
  MonthlyReportForecast,
  TelemetryMessage,
  LastSixMonthsHistory,
  LastHourHistory,
  LastDayHistory,
  LastMonthHistory,
} from "@/services/types";

export async function getTariff(): Promise<Tariff | undefined> {
  try {
    const res = await fetch(NextApiPaths.tariff.get());

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function updateTariff(
  id: string,
  tariff: Partial<Tariff>
): Promise<Tariff | undefined> {
  try {
    const res = await fetch(NextApiPaths.tariff.update(id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tariff),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function getMonthlyReport(
  calibrate?: boolean
): Promise<MonthlyReport | undefined> {
  try {
    const res = await fetch(NextApiPaths.monthlyReport.get(calibrate));

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function getMonthlyReportForecast(
  calibrate?: boolean
): Promise<MonthlyReportForecast | undefined> {
  try {
    const res = await fetch(NextApiPaths.monthlyReportForecast.get(calibrate));

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
  const socket = new WebSocket(ApiPaths.websocket.telemetry(), [clientId]);

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

export async function getLastSixMonthsReport(
  calibrate?: boolean
): Promise<LastSixMonthsHistory | undefined> {
  try {
    const res = await fetch(NextApiPaths.history.lastSixMonths(calibrate));

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function getLastHourPerMinute(
  calibrate?: boolean
): Promise<LastHourHistory | undefined> {
  try {
    const res = await fetch(NextApiPaths.history.lastHour(calibrate));

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function getLastDayHourly(
  calibrate?: boolean
): Promise<LastDayHistory | undefined> {
  try {
    const res = await fetch(NextApiPaths.history.lastDay(calibrate));

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function getLastMonthDaily(
  calibrate?: boolean
): Promise<LastMonthHistory | undefined> {
  try {
    const res = await fetch(NextApiPaths.history.lastMonth(calibrate));

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

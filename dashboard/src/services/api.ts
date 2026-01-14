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
    const res = await fetch(`/api/tariff/${id}`, {
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

export async function getMonthlyReport(): Promise<MonthlyReport | undefined> {
  try {
    const res = await fetch(NextApiPaths.monthlyReport.get());

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
    const res = await fetch(NextApiPaths.monthlyReportForecast.get());

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

export async function getLastSixMonthsReport(): Promise<
  LastSixMonthsHistory | undefined
> {
  try {
    const res = await fetch(NextApiPaths.history.lastSixMonths());

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
    const res = await fetch(NextApiPaths.history.lastHour());

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function getLastDayHourly(): Promise<LastDayHistory | undefined> {
  try {
    const res = await fetch(NextApiPaths.history.lastDay());

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function getLastMonthDaily(): Promise<
  LastMonthHistory | undefined
> {
  try {
    const res = await fetch(NextApiPaths.history.lastMonth());

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

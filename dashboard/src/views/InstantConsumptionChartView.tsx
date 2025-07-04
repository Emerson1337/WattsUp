"use client";

import { useEffect, useState } from "react";
import { AreaChartInteractive } from "@/components/charts/AreaChartInteractive";
import { type ChartConfig } from "@/components/ui/chart";
import { listenToSocket } from "@/services/api";
import { useDataLayer } from "@/components/context/DataLayerContext";
import { OneMinuteConsumptionMock } from "@/lib/utils";

const chartConfig = {
  consumption: {
    label: "Consumo instantâneo (Watts)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function InstantConsumptionChartView() {
  const { state } = useDataLayer();
  const { instantConsumptionSocket } = state;
  const [data, setData] = useState<{ consumption: number }[]>(
    OneMinuteConsumptionMock()
  );
  const [error, setError] = useState<Event>();
  const [connectionStartTime, setConnectionStartTime] = useState<number>(0);

  useEffect(() => {
    if (!instantConsumptionSocket) return;

    // Set connection start time when socket is available
    if (connectionStartTime === 0) {
      setConnectionStartTime(Date.now());
    }

    listenToSocket(
      instantConsumptionSocket,
      (telemetryMessage) => {
        // Calculate relative time since connection start
        const currentTime = Date.now();
        const relativeTime = currentTime - connectionStartTime;
        const esp32Time = telemetryMessage.timestamp;
        const transmissionTime = relativeTime - esp32Time;

        console.log(
          `[PERFORMANCE] Transmission time: ${transmissionTime}ms`,
          `ESP32 time: ${esp32Time}ms`,
          `Relative time: ${relativeTime}ms`
        );

        setData([
          ...data,
          {
            consumption: telemetryMessage.power,
          },
        ]);
      },
      setError
    );

    if (error) {
      console.error("Error connecting to live data:", error);
    }
  }, [data, error, instantConsumptionSocket, connectionStartTime]);

  return (
    <AreaChartInteractive
      data={data}
      config={chartConfig}
      liveBadge
      tooltipUnit="W"
      title="Consumo instantâneo"
      description={`Atualizado a cada segundo`}
    />
  );
}

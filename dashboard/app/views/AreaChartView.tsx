"use client";

import { useEffect, useState } from "react";
import { AreaChartInteractive } from "@/components/charts/AreaChartInteractive";
import { subscribeToLiveAreaChartData } from "@/services/api";
import { type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  consumption: { label: "Consumo instantâneo (kW)", color: "var(--chart-2)" },
} satisfies ChartConfig;

export default function AreaChartWithLiveData() {
  const [data, setData] = useState<{ consumption: number }[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToLiveAreaChartData(setData);
    return unsubscribe;
  }, []);

  return (
    <AreaChartInteractive
      data={data}
      config={chartConfig}
      title="Consumo instantâneo"
      description={`Atualizado a cada segundo (${
        data[data.length - 1]?.consumption
      } W)`}
    />
  );
}

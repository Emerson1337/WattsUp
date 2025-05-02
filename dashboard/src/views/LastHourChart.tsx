"use client";

import { useEffect, useState } from "react";
import { BarChartInteractive } from "@/components/charts/BarChartInteractive";
import type { ChartConfig } from "@/components/ui/chart";
import { fetchBarChartInteractiveData } from "@/services/facade";
import Spinner from "@/components/ui/spinner";

const chartConfig: ChartConfig = {
  consumption: {
    label: "Consumo",
    color: "var(--chart-2)",
  },
};

export default function LastHourChart() {
  const [data, setData] = useState<
    { date: string; consumption: number }[] | null
  >(null);

  useEffect(() => {
    fetchBarChartInteractiveData().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="text-center flex w-full items-center justify-center text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  return (
    <BarChartInteractive
      title="Consumo - Última hora"
      description="Consumo na última hora"
      data={data}
      dateKey="date"
      chartConfig={chartConfig}
      initialActiveChart="consumption"
      totalLabel="Consumo total"
    />
  );
}

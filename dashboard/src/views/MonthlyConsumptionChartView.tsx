"use client";

import { RadialChartText } from "@/components/charts/RadialChart";
import type { ChartConfig } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { fetchRadialChartData } from "@/services/facade";
import Spinner from "@/components/ui/spinner";

const chartConfig = {
  consumption: {
    label: "Consumo",
  },
} satisfies ChartConfig;

export default function MonthlyConsumptionChartView() {
  const [data, setData] = useState<
    { consumption: number; fill: string }[] | null
  >(null);

  useEffect(() => {
    fetchRadialChartData().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="text-center flex w-full items-center justify-center text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  return (
    <RadialChartText
      title="Consumo mensal"
      periodDescription="Consumo nos últimos 30 dias"
      data={data}
      startAngle={240}
      unit="kWh"
      valueKey="consumption"
      chartConfig={chartConfig}
      trendText="Expectativa de aumento em 5.2% esse mês."
      footerDescription="Consumo nos últimos 30 dias"
    />
  );
}

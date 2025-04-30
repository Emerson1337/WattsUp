"use client";

import { RadialChartText } from "@/components/charts/RadialChart";
import type { ChartConfig } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { fetchRadialChartData } from "@/services/api";

const radialData = [{ consumption: 200, fill: "var(--chart-2)" }];

const chartConfig3 = {
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
      <div className="text-center text-muted-foreground">Carregando...</div>
    );
  }

  return (
    <RadialChartText
      title="Consumo mensal"
      periodDescription="Consumo nos últimos 30 dias"
      data={radialData}
      startAngle={240}
      unit="kWh"
      valueKey="consumption"
      chartConfig={chartConfig3}
      trendText="Expectativa de aumento em 5.2% esse mês."
      footerDescription="Consumo nos últimos 30 dias"
    />
  );
}

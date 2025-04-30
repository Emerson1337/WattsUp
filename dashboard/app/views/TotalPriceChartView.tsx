"use client";

import { useEffect, useState } from "react";
import type { ChartConfig } from "@/components/ui/chart";
import { fetchMonthlyConsumptionData } from "@/services/api";
import { DonutChart } from "@/components/charts/DonutChart";

const chartConfig: ChartConfig = {
  energyConsumption: {
    label: "Consumo elétrico",
    color: "var(--chart-1)",
  },
  taxes: {
    label: "TSDU + TSE",
    color: "var(--chart-2)",
  },
  publicLighting: {
    label: "Iluminação pública",
    color: "var(--chart-3)",
  },
};

export default function TotalPriceChartView() {
  const [data, setData] = useState<
    { name: string; value: number; fill: string }[] | null
  >(null);

  useEffect(() => {
    fetchMonthlyConsumptionData().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="text-center text-muted-foreground">Carregando...</div>
    );
  }

  return (
    <DonutChart
      title="Consumo Mensal"
      description="Consumo energético, taxas e custo de iluminação pública."
      data={data}
      unit="R$"
      chartConfig={chartConfig}
      footerText="Total de consumo nos últimos 30 dias"
    />
  );
}

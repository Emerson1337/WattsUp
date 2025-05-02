"use client";

import { useEffect, useState } from "react";
import { SimpleBarChartMultiple } from "@/components/charts/SimpleBarChartMultiple";
import type { ChartConfig } from "@/components/ui/chart";
import { fetchSimpleBarChartMultipleData } from "@/services/facade";
import Spinner from "@/components/ui/spinner";

const chartConfig: ChartConfig = {
  past: {
    label: "Passado",
    color: "var(--chart-3)",
  },
  current: {
    label: "Atual",
    color: "var(--chart-2)",
  },
};

export default function HistoryChartView() {
  const [data, setData] = useState<
    { month: string; past: number; current: number }[] | null
  >(null);

  useEffect(() => {
    fetchSimpleBarChartMultipleData().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="text-center flex w-full items-center justify-center text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  return (
    <SimpleBarChartMultiple
      title="Histórico - Consumo"
      description="Últimos 6 meses"
      data={data || []}
      chartConfig={chartConfig}
      barKeys={["past", "current"]}
      trendPercentage={5.2}
      trendText="Aumento em relação ao mês do ano anterior"
      footerText="Consumo nos últimos 6 meses"
    />
  );
}

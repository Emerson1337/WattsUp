"use client";

import type { ChartConfig } from "@/components/ui/chart";
import { DonutChart } from "@/components/charts/DonutChart";
import { useDataLayer } from "@/components/context/DataLayerContext";
import { format } from "date-fns";

const chartConfig: ChartConfig = {
  energyConsumption: {
    label: "Tarifa de energia (TE)",
    color: "var(--chart-1)",
  },
  tusdPrice: {
    label: "TUSD",
    color: "var(--chart-2)",
  },
  extraTaxes: {
    label: "Taxas extras",
    color: "var(--chart-3)",
  },
};

export default function TotalPriceChartView() {
  const { state } = useDataLayer();
  const { monthlyReport, monthlyReportIsLoading, tariff, tariffIsLoading } =
    state;

  const tusdPrice = monthlyReport?.tusdPrice ?? 0;
  const energyConsumption = monthlyReport?.energyConsumptionPrice ?? 0;
  const extraTaxes = monthlyReport?.extraTaxes ?? 0;

  const totalPriceData = [
    {
      name: "energyConsumption",
      value: energyConsumption,
      fill: "var(--chart-2)",
    },
    {
      name: "tusdPrice",
      value: tusdPrice,
      fill: "var(--chart-4)",
    },
    {
      name: "extraTaxes",
      value: extraTaxes,
      fill: "var(--chart-3)",
    },
  ];

  return (
    <DonutChart
      isLoading={monthlyReportIsLoading || tariffIsLoading}
      title="Consumo Mensal"
      description="Consumo energético, taxas e custo de iluminação pública."
      data={totalPriceData}
      unit="R$"
      tooltipPrefix="R$"
      chartConfig={chartConfig}
      footerText={`Total de consumo no mês atual. A próxima data de leitura do seu medidor é: ${
        tariff?.nextReadingDate
          ? format(tariff.nextReadingDate, "dd/MM/yyyy")
          : "não definida"
      }. ${tariff?.description}`}
    />
  );
}

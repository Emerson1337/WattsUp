"use client";

import { MetricCard } from "@/components/ui/metric-card";

import { convertToBRL } from "@/lib/utils";
import { useDataLayer } from "@/components/context/DataLayerContext";

export function SectionCards() {
  const { state } = useDataLayer();
  const {
    tariff,
    tariffIsLoading,
    monthlyReport,
    monthlyReportIsLoading,
    monthlyReportForecast,
    monthlyReportForecastIsLoading,
  } = state;

  const kWhPriceInBRL = convertToBRL(tariff?.kWhPrice ?? 0);

  const currentConsumptionPeak =
    monthlyReport?.currentMonthPeak.currentMonthPeakKWhPrice ?? 0;
  const lastMonthPeak = monthlyReport?.lastMonthPeak.lastMonthPeakKWhPrice ?? 0;

  const consumptionGrowth =
    lastMonthPeak > 0 ? currentConsumptionPeak / lastMonthPeak - 1 : 0;

  const monthlyReportBadgeTrend =
    currentConsumptionPeak > lastMonthPeak ? "up" : "down";

  const currentMonthForecast =
    monthlyReportForecast?.currentMonthForecastWithTaxes ?? 0;

  const lastMonthConsumption =
    monthlyReportForecast?.pastMonthConsumptionWithTaxes ?? 0;

  const monthlyForecastBadgeTrend =
    currentConsumptionPeak > lastMonthPeak ? "up" : "down";

  const consumptionForecastGrowth =
    lastMonthConsumption > 0
      ? currentMonthForecast / lastMonthConsumption - 1
      : 0;

  return (
    <div className="flex gap-4 lg:flex-row flex-col">
      <MetricCard
        isLoading={tariffIsLoading}
        title="Preço do kWh"
        value={kWhPriceInBRL}
        footerMain="Tarifa convencional"
        footerSub={`Esse valor é utilizado para calcular os gastos em reais de energia. ${tariff?.description}`}
      />
      <MetricCard
        isLoading={monthlyReportIsLoading}
        title="Pico de consumo"
        value={convertToBRL(currentConsumptionPeak)}
        badgeTrend={lastMonthPeak ? monthlyReportBadgeTrend : undefined}
        badgeValue={
          consumptionGrowth
            ? `${(consumptionGrowth * 100).toFixed(2)}%`
            : undefined
        }
        footerMain={
          lastMonthPeak
            ? `Esse valor representa um ${consumptionGrowth}% de crescimento em relação ao mês passado.`
            : "Esse valor representa o pico de consumo do mês atual."
        }
        footerSub="Este valor representa uma comparação com o mês anterior."
      />
      <MetricCard
        isLoading={monthlyReportForecastIsLoading}
        title="Previsão de consumo"
        value={convertToBRL(currentMonthForecast)}
        badgeTrend={
          lastMonthConsumption ? monthlyForecastBadgeTrend : undefined
        }
        badgeValue={
          consumptionForecastGrowth
            ? `${(consumptionForecastGrowth * 100).toFixed(2)}%`
            : undefined
        }
        footerMain="Você irá pagar este valor no próximo mês."
        footerSub="Este valor representa uma previsão de consumo. O valor pode variar de acordo com o consumo real."
      />
    </div>
  );
}

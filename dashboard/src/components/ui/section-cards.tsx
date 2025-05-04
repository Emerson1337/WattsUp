"use client";

import { MetricCard } from "@/components/ui/metric-card";
import { format } from "date-fns";

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

  const currentMonthForecastWithTaxes =
    monthlyReportForecast?.currentMonthForecastWithTaxes ?? 0;

  const lastMonthConsumption =
    monthlyReportForecast?.pastMonthConsumptionWithTaxes ?? 0;

  const monthlyForecastBadgeTrend =
    currentConsumptionPeak > lastMonthPeak ? "up" : "down";

  const consumptionForecastGrowth =
    lastMonthConsumption > 0
      ? currentMonthForecastWithTaxes / lastMonthConsumption - 1
      : 0;

  const nextReadingDate = tariff?.effectiveReadingDay
    ? format(new Date().setDate(tariff.effectiveReadingDay), "dd/MM")
    : "";

  return (
    <div className="flex gap-4 lg:flex-row flex-col">
      <MetricCard
        isLoading={tariffIsLoading}
        title="Preço do kWh"
        value={kWhPriceInBRL}
        footerMain="Tarifa convencional"
        footerSub="Esse valor é utilizado para calcular os gastos em reais de energia. Esse valor pode variar de acordo com a bandeira tarifária."
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
        footerSub={
          monthlyReport?.currentMonthPeak.date
            ? `Esse valor foi registrado no dia ${format(
                monthlyReport?.currentMonthPeak.date,
                "dd/MM/yyyy"
              )}.`
            : ""
        }
      />
      <MetricCard
        isLoading={monthlyReportForecastIsLoading}
        title="Previsão de fatura"
        value={convertToBRL(currentMonthForecastWithTaxes)}
        badgeTrend={
          lastMonthConsumption ? monthlyForecastBadgeTrend : undefined
        }
        badgeValue={
          consumptionForecastGrowth
            ? `${(consumptionForecastGrowth * 100).toFixed(2)}%`
            : undefined
        }
        footerMain="Você irá pagar esse valor no próximo mês."
        footerSub={`Esse valor representa uma previsão de consumo. O valor pode variar de acordo com o modo de cobrança na fatura. Data prevista para a próxima leitura: ${nextReadingDate}`}
      />
    </div>
  );
}

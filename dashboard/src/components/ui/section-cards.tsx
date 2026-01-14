"use client";

import { MetricCard } from "@/components/ui/metric-card";
import { format, addMonths } from "date-fns";
import { convertToBRL } from "@/lib/utils";
import { useDataLayer } from "@/components/context/DataLayerContext";
import { convertToBRDecimal } from "@/lib/utils";

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
    lastMonthPeak > 0
      ? ((currentConsumptionPeak - lastMonthPeak) / lastMonthPeak) * 100
      : 0;

  const monthlyReportBadgeTrend =
    currentConsumptionPeak > lastMonthPeak ? "up" : "down";

  const currentMonthForecastWithTaxes =
    monthlyReportForecast?.currentMonthForecastWithTaxes ?? 0;

  const lastMonthConsumption =
    monthlyReportForecast?.pastMonthConsumptionWithTaxes ?? 0;

  const consumptionForecastGrowth =
    lastMonthConsumption > 0
      ? ((currentMonthForecastWithTaxes - lastMonthConsumption) /
          lastMonthConsumption) *
        100
      : 0;

  const monthlyForecastBadgeTrend = consumptionForecastGrowth ? "up" : "down";

  const nextReadingDate = tariff?.nextReadingDate
    ? format(new Date(tariff.nextReadingDate), "dd/MM")
    : "";

  return (
    <div className="flex gap-4 lg:flex-row flex-col">
      <MetricCard
        isLoading={tariffIsLoading}
        title="Preço do kWh"
        value={kWhPriceInBRL}
        footerMain="Tarifa convencional"
        footerSub="Esse valor é definido pela ANEEL. Pode variar de acordo com a bandeira tarifária."
      />
      <MetricCard
        isLoading={monthlyReportIsLoading}
        title="Pico de consumo"
        value={convertToBRL(currentConsumptionPeak)}
        badgeTrend={lastMonthPeak ? monthlyReportBadgeTrend : undefined}
        badgeValue={
          consumptionGrowth
            ? `${convertToBRDecimal(consumptionGrowth)}%`
            : undefined
        }
        footerMain={
          lastMonthPeak
            ? `Esse valor representa ${convertToBRDecimal(
                consumptionGrowth
              )}% em relação ao mês passado.`
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
            ? `${convertToBRDecimal(consumptionForecastGrowth)}%`
            : undefined
        }
        footerMain="Você irá pagar esse valor no próximo mês."
        footerSub={`Esse valor representa uma previsão de consumo. O valor pode variar de acordo com o modo de cobrança na fatura. Data prevista para a próxima leitura: ${nextReadingDate}`}
      />
    </div>
  );
}

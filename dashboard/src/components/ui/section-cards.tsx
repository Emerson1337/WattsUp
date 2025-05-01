import { MetricCard } from "@/components/ui/metric-card";

export function SectionCards() {
  const kWhPriceInBRL = (0.71).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const kWhPriceInBRLPeakInTheMonth = (10.49).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const kWhPriceInBRLForecast = (209.29).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="flex gap-4 lg:flex-row flex-col">
      <MetricCard
        title="Preço do kWh"
        value={kWhPriceInBRL}
        footerMain="Tarifa convencional"
        footerSub="Esse valor é utilizado para calcular os gastos em reais de energia."
      />
      <MetricCard
        title="Pico de consumo"
        value={kWhPriceInBRLPeakInTheMonth}
        badgeTrend="up"
        badgeValue="8%"
        footerMain="Maior consumo no último mês."
        footerSub="Este valor representa uma comparação com o mês anterior."
      />
      <MetricCard
        title="Previsão de consumo"
        value={kWhPriceInBRLForecast}
        badgeTrend="down"
        badgeValue="4%"
        footerMain="Você irá pagar este valor no próximo mês."
        footerSub="Este valor representa uma comparação com o mês anterior."
      />
    </div>
  );
}

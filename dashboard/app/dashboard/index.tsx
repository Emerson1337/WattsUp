import type { ChartConfig } from "@/components/ui/chart";
import { SimpleBarChartMultiple } from "@/components/charts/SimpleBarChartMultiple";
import { RadialChartText } from "@/components/charts/RadialChart";
import { SectionCards } from "@/components/ui/section-cards";
import { Container } from "@/components/ui/container";
import { BarChartInteractive } from "@/components/charts/BarChartInteractive";
import AreaChartView from "../views/AreaChartView";

const chartConfig3 = {
  consumption: {
    label: "Consumo",
  },
} satisfies ChartConfig;

const radialData = [{ consumption: 200, fill: "var(--chart-2)" }];

const chartConfig2 = {
  consumption: {
    label: "Consumo",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const chartData2 = [
  { date: "2024-04-01", consumption: 150 },
  { date: "2024-04-02", consumption: 180 },
  { date: "2024-04-03", consumption: 120 },
  { date: "2024-04-04", consumption: 260 },
  { date: "2024-04-05", consumption: 290 },
  { date: "2024-04-06", consumption: 340 },
  { date: "2024-04-07", consumption: 180 },
  { date: "2024-04-08", consumption: 320 },
  { date: "2024-04-09", consumption: 110 },
  { date: "2024-04-10", consumption: 190 },
  { date: "2024-04-11", consumption: 350 },
  { date: "2024-04-12", consumption: 210 },
  { date: "2024-04-13", consumption: 380 },
  { date: "2024-04-14", consumption: 220 },
  { date: "2024-04-15", consumption: 170 },
  { date: "2024-04-16", consumption: 190 },
  { date: "2024-04-17", consumption: 360 },
  { date: "2024-04-18", consumption: 410 },
  { date: "2024-04-19", consumption: 180 },
  { date: "2024-04-20", consumption: 150 },
  { date: "2024-04-21", consumption: 200 },
  { date: "2024-04-22", consumption: 170 },
  { date: "2024-04-23", consumption: 230 },
  { date: "2024-04-24", consumption: 290 },
  { date: "2024-04-25", consumption: 250 },
  { date: "2024-04-26", consumption: 130 },
  { date: "2024-04-27", consumption: 420 },
  { date: "2024-04-28", consumption: 180 },
  { date: "2024-04-29", consumption: 240 },
  { date: "2024-04-30", consumption: 380 },
  { date: "2024-05-01", consumption: 220 },
  { date: "2024-05-02", consumption: 310 },
  { date: "2024-05-03", consumption: 190 },
  { date: "2024-05-04", consumption: 420 },
  { date: "2024-05-05", consumption: 390 },
  { date: "2024-05-06", consumption: 520 },
  { date: "2024-05-07", consumption: 300 },
  { date: "2024-05-08", consumption: 210 },
  { date: "2024-05-09", consumption: 180 },
  { date: "2024-05-10", consumption: 330 },
  { date: "2024-05-11", consumption: 270 },
  { date: "2024-05-12", consumption: 240 },
  { date: "2024-05-13", consumption: 160 },
  { date: "2024-05-14", consumption: 490 },
  { date: "2024-05-15", consumption: 380 },
  { date: "2024-05-16", consumption: 400 },
  { date: "2024-05-17", consumption: 420 },
  { date: "2024-05-18", consumption: 350 },
  { date: "2024-05-19", consumption: 180 },
  { date: "2024-05-20", consumption: 230 },
  { date: "2024-05-21", consumption: 140 },
  { date: "2024-05-22", consumption: 120 },
  { date: "2024-05-23", consumption: 290 },
  { date: "2024-05-24", consumption: 220 },
  { date: "2024-05-25", consumption: 250 },
  { date: "2024-05-26", consumption: 170 },
  { date: "2024-05-27", consumption: 460 },
  { date: "2024-05-28", consumption: 190 },
  { date: "2024-05-29", consumption: 130 },
  { date: "2024-05-30", consumption: 280 },
  { date: "2024-05-31", consumption: 230 },
  { date: "2024-06-01", consumption: 200 },
  { date: "2024-06-02", consumption: 410 },
  { date: "2024-06-03", consumption: 160 },
  { date: "2024-06-04", consumption: 380 },
  { date: "2024-06-05", consumption: 140 },
  { date: "2024-06-06", consumption: 250 },
  { date: "2024-06-07", consumption: 370 },
  { date: "2024-06-08", consumption: 320 },
  { date: "2024-06-09", consumption: 480 },
  { date: "2024-06-10", consumption: 200 },
  { date: "2024-06-11", consumption: 150 },
  { date: "2024-06-12", consumption: 420 },
  { date: "2024-06-13", consumption: 130 },
  { date: "2024-06-14", consumption: 380 },
  { date: "2024-06-15", consumption: 350 },
  { date: "2024-06-16", consumption: 310 },
  { date: "2024-06-17", consumption: 520 },
  { date: "2024-06-18", consumption: 170 },
  { date: "2024-06-19", consumption: 290 },
  { date: "2024-06-20", consumption: 450 },
  { date: "2024-06-21", consumption: 210 },
  { date: "2024-06-22", consumption: 270 },
  { date: "2024-06-23", consumption: 530 },
  { date: "2024-06-24", consumption: 180 },
  { date: "2024-06-25", consumption: 190 },
  { date: "2024-06-26", consumption: 380 },
  { date: "2024-06-27", consumption: 490 },
  { date: "2024-06-28", consumption: 200 },
  { date: "2024-06-29", consumption: 160 },
  { date: "2024-06-30", consumption: 400 },
];

const chartData4 = [
  { month: "January", past: 186, current: 80 },
  { month: "February", past: 305, current: 200 },
  { month: "March", past: 237, current: 120 },
  { month: "April", past: 73, current: 190 },
  { month: "May", past: 209, current: 130 },
  { month: "June", past: 214, current: 140 },
];

const chartConfig4 = {
  past: {
    label: "Passado",
    color: "var(--chart-3)",
  },
  current: {
    label: "Atual",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function Dashboard() {
  return (
    <main className="container mx-auto my-20">
      <Container>
        <SectionCards />
        <AreaChartView />
        <div className="flex gap-4 flex-col *:flex-1">
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
          <SimpleBarChartMultiple
            title="Histórico - Consumo"
            description="Últimos 6 meses"
            data={chartData4}
            chartConfig={chartConfig4}
            barKeys={["past", "current"]}
            trendPercentage={5.2}
            trendText="Aumento em relação ao mês do ano anterior"
            footerText="Consumo nos últimos 6 meses"
          />
        </div>
        <BarChartInteractive
          title="Consumo - Última hora"
          description="Consumo na última hora"
          data={chartData2}
          dateKey="date"
          chartConfig={chartConfig2}
          initialActiveChart="consumption"
          totalLabel="Consumo total"
        />
      </Container>
    </main>
  );
}

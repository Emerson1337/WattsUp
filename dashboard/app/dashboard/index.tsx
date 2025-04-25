import { useEffect, useState } from "react";
import { AreaChartInteractive } from "@/components/charts/AreaChartInteractive";
import type { ChartConfig } from "@/components/ui/chart";
import { BarChartInteractive } from "../components/charts/BarChartInteractive";
import { RadialChartText } from "../components/charts/RadialChart";

const chartConfig = {
  comsuption: { label: "Consumo instantâneo (kW)", color: "var(--chart-2)" },
} satisfies ChartConfig;

const chartConfig3 = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const radialData = [
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
];

const chartConfig2 = {
  views: {
    label: "Page Views",
  },
  consumption: {
    label: "Desktop",
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

export function Dashboard() {
  const [chartData, setChartData] = useState([
    { date: "2024-06-01", comsuption: 100 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        const lastDate = new Date(prev[prev.length - 1].date);
        lastDate.setDate(lastDate.getDate() + 1);
        const newPoint = {
          date: lastDate.toISOString().split("T")[0],
          comsuption: Math.max(
            50,
            Math.min(
              300,
              prev[prev.length - 1].comsuption +
                (Math.random() > 0.5 ? 10 : -10)
            )
          ),
        };
        return [...prev.slice(-89), newPoint]; // keep max 90 points
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container mx-auto mt-20">
      <AreaChartInteractive
        data={chartData}
        config={chartConfig}
        title="Live Visitors"
        description="Updated every second"
      />

      <BarChartInteractive
        title="Bar Chart - Interactive"
        description="Showing total visitors for the last 3 months"
        data={chartData2}
        dateKey="date"
        chartConfig={chartConfig2}
        initialActiveChart="consumption"
        totalLabel="views"
      />

      <RadialChartText
        title="Radial Chart - Text"
        periodDescription="January - June 2024"
        data={radialData}
        valueKey="visitors"
        chartConfig={chartConfig3}
        trendText="Trending up by 5.2% this month"
        footerDescription="Showing total visitors for the last 6 months"
      />
    </main>
  );
}

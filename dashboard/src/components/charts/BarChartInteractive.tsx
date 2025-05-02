"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import Spinner from "@/components/ui/spinner";
import { convertToBRDecimal } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BarChartInteractiveProps<T extends string> {
  title: string;
  description: string;
  data: Array<Record<string, string | number>>;
  dateKey: string;
  chartConfig: ChartConfig;
  initialActiveChart: T;
  totalLabel: string;
  isLoading?: boolean;
  unit?: string;
}

export function BarChartInteractive<T extends string>({
  title,
  description,
  data,
  dateKey,
  chartConfig,
  initialActiveChart,
  totalLabel,
  isLoading,
  unit,
}: BarChartInteractiveProps<T>) {
  const [activeChart, setActiveChart] = React.useState<T>(initialActiveChart);

  const total = React.useMemo(() => {
    const result: Record<string, number> = {};
    Object.keys(chartConfig).forEach((key) => {
      if (key !== "views") {
        result[key] = data.reduce(
          (acc, curr) => acc + (typeof curr[key] === "number" ? curr[key] : 0),
          0
        );
      }
    });
    return result;
  }, [data, chartConfig]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex">
          {Object.keys(chartConfig).map((key) => {
            if (key === "views") return null;
            const chart = key as T;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {totalLabel}
                </span>
                <span className="text-lg font-bold leading-lg sm:text-3xl">
                  {convertToBRDecimal(total[chart])} {unit}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isLoading ? (
          <div className="h-[350px] flex items-center justify-center">
            <Spinner size={40} />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={dateKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <ChartTooltip content={<ChartTooltipContent unit={unit} />} />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

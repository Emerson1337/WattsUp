"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartDataItem {
  month: string;
  [key: string]: number | string; // Allows any numeric metrics plus month string
}

interface SimpleBarChartMultipleProps {
  title: string;
  description: string;
  data: ChartDataItem[];
  chartConfig: ChartConfig;
  trendPercentage?: number;
  trendText?: string;
  footerText: string;
  barKeys?: string[]; // Optional - will use all numeric keys if not provided
}

export function SimpleBarChartMultiple({
  title,
  description,
  data,
  chartConfig,
  trendPercentage,
  trendText,
  footerText,
  barKeys,
}: SimpleBarChartMultipleProps) {
  // If barKeys not provided, use all numeric keys except 'month'
  const keysToRender =
    barKeys ||
    Object.keys(data[0] || {}).filter(
      (key) => key !== "month" && typeof data[0][key] === "number"
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {keysToRender.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={`var(--color-${key})`}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {trendText && trendPercentage && (
          <div className="flex gap-2 font-medium leading-none">
            {trendText} {trendPercentage}% <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="leading-none text-muted-foreground">{footerText}</div>
      </CardFooter>
    </Card>
  );
}

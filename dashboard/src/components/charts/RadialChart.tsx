"use client";

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import Spinner from "@/components/ui/spinner";

interface RadialChartTextProps<T extends string> {
  title: string;
  periodDescription: string;
  data: Array<
    {
      [key in T]: string;
    } & {
      fill: string;
    }
  >;
  valueKey: T;
  unit: string;
  chartConfig: ChartConfig;
  trendText?: string;
  footerDescription?: string;
  innerRadius?: number;
  outerRadius?: number;
  endAngle?: number;
  isLoading?: boolean;
}

export function RadialChartText<T extends string>({
  title,
  periodDescription,
  data,
  isLoading = false,
  valueKey,
  chartConfig,
  unit,
  trendText = "",
  footerDescription = "",
  innerRadius = 130,
  outerRadius = 160,
  endAngle = 0,
}: RadialChartTextProps<T>) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{periodDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="h-[350px] flex items-center justify-center">
            <Spinner size={40} />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[350px]"
          >
            <RadialBarChart
              data={data}
              startAngle={0}
              endAngle={endAngle}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[136, 124]}
              />
              <RadialBar dataKey={valueKey} background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-4xl font-bold"
                          >
                            {data[0][valueKey]}
                            <tspan
                              dx={4}
                              className="fill-muted-foreground text-sm font-normal"
                            >
                              {unit}
                            </tspan>
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {chartConfig[valueKey]?.label || "Value"}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {trendText && (
          <div className="flex items-center gap-2 font-medium leading-none">
            {trendText} <TrendingUp className="h-4 w-4" />
          </div>
        )}
        {footerDescription && (
          <div className="leading-none text-muted-foreground">
            {footerDescription}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

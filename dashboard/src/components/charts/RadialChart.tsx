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
import { convertToBRDecimal } from "../../lib/utils";

interface RadialChartTextProps<T extends string> {
  title: string;
  periodDescription: string;
  data: {
    [key in T]: string;
  } & {
    fill: string;
  };
  valueKey: T;
  unit: string;
  chartConfig: ChartConfig;
  trendText?: string;
  trendIcon?: boolean;
  footerDescription?: string;
  innerRadius?: number;
  outerRadius?: number;
  isLoading?: boolean;
  total?: number;
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
  trendIcon,
  total,
}: RadialChartTextProps<T>) {
  const degrees = (Number(data[valueKey]) / (total ?? 1)) * 360;

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
              data={[data]}
              startAngle={0}
              endAngle={degrees}
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
                            {convertToBRDecimal(Number(data[valueKey]))}
                            <tspan
                              dx={4}
                              className="fill-muted-foreground text-lg"
                            >
                              {!!total && `/ ${convertToBRDecimal(total)}`}
                            </tspan>
                          </tspan>

                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 34}
                            className="fill-muted-foreground text-xl"
                          >
                            {unit}
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
      {isLoading ? (
        <div className="animate-pulse mx-6 space-y-2 w-full">
          <div className="h-4 bg-muted-foreground rounded w-1/2" />
          <div className="h-9 bg-muted-foreground rounded w-3/4" />
        </div>
      ) : (
        <CardFooter className="flex-col gap-2 text-sm">
          {trendText && (
            <div className="flex items-center gap-2 font-medium leading-lg">
              {trendText} {trendIcon && <TrendingUp className="h-4 w-4" />}
            </div>
          )}
          {footerDescription && (
            <div className="leading-lg text-muted-foreground">
              {footerDescription}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

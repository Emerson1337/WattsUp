"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import Spinner from "@/components/ui/spinner";
import { convertToBRDecimal } from "@/lib/utils";

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

type DonutChartProps = {
  title: string;
  description?: string;
  data: {
    name: string;
    value: number;
    fill?: string;
  }[];
  chartConfig: ChartConfig;
  dataKey?: string;
  nameKey?: string;
  unit?: string;
  trendText?: string;
  trendIcon?: React.ReactNode;
  footerText?: string;
  tooltipLabel?: string;
  isLoading?: boolean;
  tooltipPrefix?: string;
};

export function DonutChart({
  title,
  description,
  data,
  chartConfig,
  dataKey = "value",
  nameKey = "name",
  unit = "",
  trendText,
  trendIcon,
  footerText,
  tooltipLabel,
  tooltipPrefix,
  isLoading = false,
}: DonutChartProps) {
  const total = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="h-[350px] flex items-center justify-center">
            <Spinner size={40} />
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[350px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      prefix={tooltipPrefix}
                      label={tooltipLabel}
                      hideLabel={!tooltipLabel}
                    />
                  }
                />
                <Pie
                  data={data}
                  dataKey={dataKey}
                  nameKey={nameKey}
                  innerRadius={110}
                  strokeWidth={8}
                >
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
                              className="fill-foreground text-3xl font-bold"
                            >
                              {unit && ` ${unit} `}
                              {convertToBRDecimal(total)}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground text-sm"
                            >
                              Total
                            </tspan>
                          </text>
                        );
                      }
                      return null;
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex -mt-5 flex-wrap justify-center gap-4">
              {data.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{
                      backgroundColor: entry.fill,
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {chartConfig[entry.name].label}
                  </span>
                </div>
              ))}
            </div>
          </>
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
              {trendText} {trendIcon}
            </div>
          )}
          {footerText && (
            <div className="leading-lg text-muted-foreground">{footerText}</div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

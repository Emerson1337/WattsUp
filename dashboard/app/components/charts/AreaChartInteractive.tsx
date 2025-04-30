import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DataPoint = {
  [key: string]: string | number;
};

type Props = {
  data: DataPoint[];
  config: ChartConfig;
  title?: string;
  description?: string;
};

export function AreaChartInteractive({
  data,
  config,
  title,
  description,
}: Props) {
  const [timeRange, setTimeRange] = React.useState("30");

  const filteredData = React.useMemo(() => {
    if (data.length === 0) return [];
    const numberTimeRange = Number(timeRange);
    return data.slice(data.length - numberTimeRange, data.length);
  }, [data, timeRange]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="60">Último minuto</SelectItem>
            <SelectItem value="30">Últimos 30 seg.</SelectItem>
            <SelectItem value="10">Últimos 10 seg.</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={config} className="h-[250px] w-full">
          <AreaChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => String(value)}
                  indicator="dot"
                />
              }
            />
            {Object.keys(config)
              .filter((key) => key !== "label")
              .map((key) => (
                <Area
                  key={key}
                  type="basis"
                  dataKey={key}
                  stackId="a"
                  stroke={config[key].color}
                  fill={config[key].color}
                />
              ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

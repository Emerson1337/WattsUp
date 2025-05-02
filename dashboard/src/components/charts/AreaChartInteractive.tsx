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
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import LiveBadge from "../ui/live-badge";

type DataPoint = {
  [key: string]: string | number;
};

type Props = {
  data: DataPoint[];
  config: ChartConfig;
  title?: string;
  description?: string;
  tooltipUnit?: string;
  liveBadge?: boolean;
};

export function AreaChartInteractive({
  data,
  config,
  title,
  liveBadge,
  description,
  tooltipUnit,
}: Props) {
  const [timeRange, setTimeRange] = React.useState("30");

  const filteredData = React.useMemo(() => {
    if (data.length === 0) return [];
    const numberTimeRange = Number(timeRange);
    return data.slice(data.length - numberTimeRange, data.length);
  }, [data, timeRange]);

  const lastEntry = filteredData[filteredData.length - 1];
  const secondLastEntry = filteredData[filteredData.length - 2];

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b pb-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          {liveBadge && <LiveBadge />}
          <CardTitle className="flex gap-4 mt-2">{title}</CardTitle>
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex relative">
        <ChartContainer config={config} className="h-[250px] w-full">
          <AreaChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  fractionDigits={0}
                  unit={tooltipUnit}
                  indicator="dashed"
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
        <div className="px-4 w-24 items-center h-full absolute -top-5 right-4">
          <div className="flex text-2xl gap-1 justify-center">
            <span>{lastEntry.consumption}</span>
            <span className="text-muted-foreground">{tooltipUnit}</span>
          </div>
          <div className="flex justify-end">
            {lastEntry.consumption > secondLastEntry.consumption ? (
              <TrendingUpIcon className="text-red-600" />
            ) : (
              <TrendingDownIcon className="text-primary" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

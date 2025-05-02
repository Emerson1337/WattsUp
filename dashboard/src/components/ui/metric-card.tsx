import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  description?: string;
  value: string;
  badgeValue?: string;
  badgeTrend?: "up" | "down";
  footerMain: string;
  footerSub: string;
  className?: string;
  isLoading?: boolean;
}

export function MetricCard({
  title,
  isLoading = false,
  description,
  value,
  badgeValue,
  badgeTrend,
  footerMain,
  footerSub,
  className,
}: MetricCardProps) {
  const TrendIcon = badgeTrend === "up" ? TrendingUpIcon : TrendingDownIcon;

  if (isLoading) return <LoadingMetricCard />;

  return (
    <Card className={cn("@container/card w-full", className)}>
      <CardHeader className="relative">
        {description && <CardDescription>{description}</CardDescription>}

        <div className="text-sm font-medium text-muted-foreground mb-1">
          {isLoading ? (
            <div className="animate-pulse h-3 bg-muted-foreground rounded w-full"></div>
          ) : (
            title
          )}
        </div>

        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums number-increasing-animation">
          {value}
        </CardTitle>

        {badgeValue && (
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              {badgeTrend && <TrendIcon className="size-3" />}
              {badgeValue}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {footerMain} {badgeTrend && <TrendIcon className="size-4" />}
        </div>
        <div className="text-muted-foreground">{footerSub}</div>
      </CardFooter>
    </Card>
  );
}

const LoadingMetricCard = () => (
  <Card className="w-full">
    <CardHeader>
      <div className="animate-pulse space-y-3">
        <div className="h-3 bg-muted-foreground rounded w-1/3" />
        <div className="h-12 bg-muted-foreground rounded w-2/3" />
      </div>
    </CardHeader>
    <CardFooter className="flex-col items-start">
      <div className="animate-pulse space-y-2 w-full">
        <div className="h-4 bg-muted-foreground rounded w-1/2" />
        <div className="h-12 bg-muted-foreground rounded w-3/4" />
      </div>
    </CardFooter>
  </Card>
);

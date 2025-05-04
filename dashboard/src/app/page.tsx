import { SectionCards } from "@/components/ui/section-cards";
import { Container } from "@/components/ui/container";
import InstantConsumptionChartView from "@/views/InstantConsumptionChartView";
import MonthlyConsumptionChartView from "@/views/MonthlyConsumptionChartView";
import HistoryChartView from "@/views/HistoryChartView";
import LastHourChartView from "@/views/LastHourChartView";
import TotalPriceChartView from "@/views/TotalPriceChartView";
import { DataLayerProvider } from "@/components/context/DataLayerContext";
import LastDayChartView from "@/views/LastDayChartView";

export default function Home() {
  return (
    <main className="container mx-auto mb-20">
      <Container>
        <DataLayerProvider>
          <SectionCards />
          <div className="flex gap-4 lg:flex-row flex-col *:flex-1">
            <TotalPriceChartView />
            <MonthlyConsumptionChartView />
          </div>
          <InstantConsumptionChartView />
          <div className="flex gap-4 lg:flex-row flex-col *:flex-1">
            <HistoryChartView />
            <LastHourChartView />
          </div>
          <LastDayChartView />
        </DataLayerProvider>
      </Container>
    </main>
  );
}

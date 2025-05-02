import { SectionCards } from "@/components/ui/section-cards";
import { Container } from "@/components/ui/container";
import InstantConsumptionChartView from "@/views/InstantConsumptionChartView";
import MonthlyConsumptionChartView from "@/views/MonthlyConsumptionChartView";
import HistoryChartView from "@/views/HistoryChartView";
import LastHourChart from "@/views/LastHourChart";
import TotalPriceChartView from "@/views/TotalPriceChartView";
import { DataLayerProvider } from "@/components/context/DataLayerContext";

export default function Home() {
  return (
    <main className="container mx-auto mb-20">
      <Container>
        <DataLayerProvider>
          <SectionCards />
          <InstantConsumptionChartView />
          <TotalPriceChartView />
          <div className="flex gap-4 lg:flex-row flex-col *:flex-1">
            <MonthlyConsumptionChartView />
            <HistoryChartView />
          </div>
          <LastHourChart />
        </DataLayerProvider>
      </Container>
    </main>
  );
}

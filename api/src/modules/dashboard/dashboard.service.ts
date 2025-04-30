import DashboardRepository from "@/modules/dashboard/dashboard.repository";
import { Tariffs as PrismaTariffs } from "@prisma/client";

class DashboardService {
  getTariffs = async (): Promise<PrismaTariffs | undefined> => {
    const tariff = await DashboardRepository.findTariff();

    if (!tariff) {
      return undefined;
    }

    return tariff;
  };

  getMonthlyConsumption = async (): Promise<
    | {
        energyConsumption: number;
        taxes: number;
        publicLighting: number;
      }
    | undefined
  > => {
    const currentMonthConsumption =
      await DashboardRepository.findCurrentMonthConsumption();
    if (!currentMonthConsumption) {
      throw new Error("Consumo mensal não encontrado.");
    }

    const tariff = await DashboardRepository.findTariff();

    if (!tariff) {
      throw new Error("Tarifa não encontrada.");
    }

    const energyConsumption = currentMonthConsumption.kWh * tariff.kWhPrice;
    const taxes = currentMonthConsumption.kWh * tariff.kWhPriceTaxes;
    const publicLighting = tariff.publicLightingPrice;

    return {
      energyConsumption,
      taxes,
      publicLighting,
    };
  };
}

export default new DashboardService();

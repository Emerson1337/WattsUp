import TelemetryRepository from "@/modules/telemetry/telemetry.repository";
import { subHours, startOfHour } from "date-fns";
import { getBrazilianUTCDate } from "../../shared/utils/index";

export const runSaveKWhJob = async () => {
  console.log("🟡 Running hourly job to save kWh");

  console.log(
    "🟢🟢🟢🟢 subHours(getBrazilianUTCDate(), 1)",
    startOfHour(subHours(getBrazilianUTCDate(), 1))
  );

  // const powerFromLastHour = await TelemetryRepository.getPowerFromLastHour();

  // const totalPowerFromLastHour = powerFromLastHour.reduce((acc, report) => {
  //   return acc + report.kW;
  // }, 0);

  // const powerInKwh = totalPowerFromLastHour / 60;

  // await TelemetryRepository.saveKWhPerHour(powerInKwh);
  // await TelemetryRepository.incrementKWhInCurrentMonth(powerInKwh);
  // await TelemetryRepository.incrementKWhInCurrentDay(powerInKwh);

  console.log("🟢 Hourly job ran successfully!");
};

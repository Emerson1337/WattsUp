import TelemetryRepository from "@/modules/telemetry/telemetry.repository";
import DashboardRepository from "@/modules/dashboard/dashboard.repository";
import { addMonths } from "date-fns";

export const runSaveKWhJob = async () => {
  console.log("🟡 Running hourly job to save kWh");

  const powerFromLastHour = await TelemetryRepository.getPowerFromLastHour();

  const tariff = await DashboardRepository.findTariff();

  if (!tariff) throw new Error("Tarifa não encontrada.");

  const totalPowerFromLastHour = powerFromLastHour.reduce((acc, report) => {
    return acc + report.kW;
  }, 0);

  const powerInKwh = totalPowerFromLastHour / 60;
  const effectiveReadingDay = tariff.nextReadingDate.getDate();

  await TelemetryRepository.saveKWhPerHour(powerInKwh);
  await TelemetryRepository.incrementKWhInCurrentMonth(
    powerInKwh,
    effectiveReadingDay
  );
  await TelemetryRepository.incrementKWhInCurrentDayBrazilianTZ(powerInKwh);

  console.log("🟢 Hourly job ran successfully!");
};

export const updateTariffLastReading = async () => {
  console.log(
    "🟡 Running monthly job to update last reading and next reading date"
  );

  const tariff = await DashboardRepository.findTariff();

  if (!tariff) throw new Error("Tarifa não encontrada.");

  const newLastReading = tariff.nextReadingDate;
  const newNextReadingDate = addMonths(tariff.nextReadingDate, 1);

  await TelemetryRepository.updateLastReadingTariff();
  await DashboardRepository.updateTariff(tariff.id, {
    lastReading: newLastReading,
    nextReadingDate: newNextReadingDate,
  });

  console.log("🟢 Monthly job to update last reading ran successfully!");
  console.log(
    `📅 Updated: lastReading = ${newLastReading.toISOString()}, nextReadingDate = ${newNextReadingDate.toISOString()}`
  );
};

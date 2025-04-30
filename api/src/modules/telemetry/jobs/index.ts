import TelemetryRepository from "@/modules/telemetry/telemetry.repository";

export const runSaveKWhJob = async () => {
  console.log("🟡 Running hourly job to save kWh");

  const powerFromLastHour = await TelemetryRepository.getPowerFromLastHour();

  const totalPowerFromLastHour = powerFromLastHour.reduce((acc, report) => {
    return acc + report.kW;
  }, 0);

  const powerInKwh = totalPowerFromLastHour / 60;

  await TelemetryRepository.saveKWhPerHour(powerInKwh);
  await TelemetryRepository.incrementKWhInCurrentMonth(powerInKwh);
  await TelemetryRepository.incrementKWhInCurrentDayBrazilianTZ(powerInKwh);

  console.log("🟢 Hourly job ran successfully!");
};

export const updateTariffLastReading = async () => {
  console.log("🟡 Running monthly job to update last reading");

  await TelemetryRepository.updateLastReadingTariff();

  console.log("🟢 Monthly job to update last reading ran successfully!");
};

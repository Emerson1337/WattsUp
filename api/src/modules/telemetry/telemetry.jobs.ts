import cron from "node-cron";
import TelemetryRepository from "@/modules/telemetry/telemetry.repository";

//Hourly
cron.schedule("0 * * * *", async () => {
  const powerFromLastHour = await TelemetryRepository.getPowerFromLastHour();

  const totalPowerFromLastHour = powerFromLastHour.reduce((acc, report) => {
    return acc + report.kW;
  }, 0);

  const powerInKwh = totalPowerFromLastHour / 60;

  await TelemetryRepository.saveKWhPerHour(powerInKwh);
  await TelemetryRepository.incrementKWhInCurrentMonth(powerInKwh);
});

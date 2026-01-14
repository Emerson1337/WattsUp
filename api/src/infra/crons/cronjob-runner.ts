import cron from "node-cron";
import {
  runSaveKWhJob,
  updateTariffLastReading,
} from "@/modules/telemetry/jobs";
import DashboardRepository from "@/modules/dashboard/dashboard.repository";
import { addDays, getDate, isSameDay } from "date-fns";

const checkAndUpdateTariffLastReading = async () => {
  const tariff = await DashboardRepository.findTariff();

  if (!tariff) {
    console.log("⚠️ Tariff not found, skipping update");
    return;
  }

  const now = new Date();
  const dayAfterNextReading = addDays(tariff.nextReadingDate, 1);

  if (isSameDay(now, dayAfterNextReading)) {
    await updateTariffLastReading();
  } else {
    const currentDay = getDate(now);
    const targetDay = getDate(dayAfterNextReading);
    console.log(
      `⏭️ Skipping update: current day (${currentDay}) does not match target day (${targetDay}, which is 1 day after next reading date ${tariff.nextReadingDate.toISOString()})`
    );
  }
};

cron.schedule("0 * * * *", runSaveKWhJob); // Hourly
cron.schedule("0 0 * * *", checkAndUpdateTariffLastReading); // Daily

if (require.main === module) {
  const [, , arg] = process.argv;

  if (arg === "run-hourly-job") {
    runSaveKWhJob()
      .catch((err) => {
        console.error("❌ Error running job:", err);
        process.exit(1);
      })
      .then(() => process.exit(0));
  }
  if (arg === "update-tariff-last-reading") {
    updateTariffLastReading()
      .catch((err) => {
        console.error("❌ Error running job:", err);
        process.exit(1);
      })
      .then(() => process.exit(0));
  } else {
    console.log("Cronjob not found");
    process.exit(0);
  }
}

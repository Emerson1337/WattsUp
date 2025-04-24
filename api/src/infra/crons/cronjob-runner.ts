import cron from "node-cron";
import { runSaveKWhJob } from "@/modules/telemetry/jobs";

//Hourly
cron.schedule("0 * * * *", runSaveKWhJob);

if (require.main === module) {
  const [, , arg] = process.argv;

  if (arg === "run-hourly-job") {
    runSaveKWhJob()
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

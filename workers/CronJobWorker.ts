import cron from "node-cron";
import {
  cleanExpiredUrlsCronJob,
  processUrlsWithDepthLimitCronJob,
  seedTopicsWithUrlsCronJob,
} from "../services/jobService";
cron.schedule(
  "0 0 * * *",
  () => {
    seedTopicsWithUrlsCronJob();
  },
  {
    timezone: "Asia/Kolkata",
  }
);





cron.schedule(
  "0 6 * * *",
  () => {
    processUrlsWithDepthLimitCronJob();
  },
  {
    timezone: "Asia/Kolkata",
  }
); 


cron.schedule(
  "0 5,17 * * *",
  () => {
    cleanExpiredUrlsCronJob();
  },
  {
    timezone: "Asia/Kolkata", // ensures IST timing
  }
);


console.log("Cron job scheduled to run every day at 6:00 AM");

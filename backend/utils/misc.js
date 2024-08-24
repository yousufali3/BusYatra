import { CronJob } from "cron";
import Bus from "../models/Bus.js";

/**
 * Check if a date is available (not in the past).
 * @param {Date} date - The date to check.
 * @returns {boolean} - True if the date is in the future or today, false otherwise.
 */
export const checkDateAvailability = (date) => new Date(date) >= new Date();

/**
 * Run a scheduled job every midnight to update the availability of buses based on their journey dates.
 */
export const runEveryMidnight = () => {
  new CronJob(
    "0 0 0 * * *", // Schedule to run at midnight every day
    async () => {
      console.log("You will see this message every midnight", new Date());
      const buses = await Bus.find({});

      buses.forEach(async (bus) => {
        if (bus.journeyDate) {
          if (!checkDateAvailability(bus.journeyDate)) {
            bus.isAvailable = false;
          }
        }
        await bus.save();
      });
    },
    null,
    true, // Start the job immediately
    "Asia/Katmandu" // Timezone
  ).start(); // Ensure the job starts
};

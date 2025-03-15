import { config, searchParams } from "./config.js";
import searchTickets from "./modules/aviasales.js";
import logError from "./utils/log-error.js";
import logMessage from "./utils/log-message.js";
import sendStatistics from "./utils/send-statistics.js";
import validateDates from "./utils/validate-date.js";

const runSearch = async () => {
  const { departDateFrom, departDateTo } = searchParams;
  let startDate = new Date(departDateFrom);
  let endDate = new Date(departDateTo);

  try {
    if (!validateDates(startDate, endDate)) {
      throw new Error("Invalid dates!");
    }
    while (startDate <= endDate) {
      const searchDate = startDate.toISOString().split("T")[0];
      await searchTickets(searchDate);
      startDate.setDate(startDate.getDate() + 1);
    }
  } catch (err) {
    logError(err, "init");
  }
};

const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

(async () => {
  const hoursToWait = 0.5;
  const delayInMilSec = hoursToWait * 60 * 60 * 1000;

  let shouldProcess = true;
  let searchInProcess = false;

  let lastSentTime = null;
  const sendHours = [14, 20];

  process.on("SIGINT", () => {
    if (searchInProcess) {
      shouldProcess = false;
      logMessage("Search is still in progress, please wait...");
      return;
    } else {
      shouldProcess = false;
      logMessage("Search completed. Exiting...");
      process.exit();
    }
  });
  logMessage("Started!");
  while (shouldProcess) {
    try {
      searchInProcess = true;
      await runSearch();
      searchInProcess = false;

      const currentHour = new Date().getHours();

      if (sendHours.includes(currentHour) && lastSentTime !== currentHour) {
        await sendStatistics();
        lastSentTime = currentHour;
      }

      await delay(delayInMilSec);
    } catch (err) {
      logError(err, "init");
    }
  }

  logMessage("Exited loop. Cleanup complete.");
  return;
})();

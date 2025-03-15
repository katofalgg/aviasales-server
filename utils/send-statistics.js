import fs from "fs";
import path, { dirname, resolve } from "path";
import logError from "./log-error.js";
import { fileURLToPath } from "url";
import sendMessage from "../modules/telegram.js";
import { config, searchParams } from "../config.js";
import { BASE_URL } from "../modules/aviasales.js";
import logMessage from "./log-message.js";

export default async function sendStatistics() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const rootDir = resolve(__dirname, "../");

    const statFolderPath = path.join(rootDir, "stat");
    if (!fs.existsSync(statFolderPath)) {
      fs.mkdirSync(statFolderPath);
    }
    const fileName = "flight_statistics.json";
    const filePath = path.join(statFolderPath, fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error("There is no statistics file");
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const cheapest = JSON.parse(fileContent).reduce(
      (min, current) => (current.price > min.price ? min : current),
      {
        price: Infinity,
      }
    );

    const transfers_time = cheapest.duration - cheapest.duration_to;
    const result = {
      ...searchParams,
      departDate: cheapest.departure_at,
      price: cheapest.price,
      link: BASE_URL + cheapest.link,
      transfers: cheapest.transfers,
      transfers_time,
      stat: true,
    };

    const chatIds = config.telegramChatId.split(",").map(Number);
    for (const id of chatIds) {
      try {
        await sendMessage(result, id);
      } catch (err) {
        logError(err, `${sendStatistics.name}(send message)`);
      }
    }
  } catch (err) {
    logError(err, sendStatistics.name);
  }
}

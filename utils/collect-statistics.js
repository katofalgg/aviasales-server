import fs from "fs";
import path, { dirname, resolve } from "path";
import logError from "./log-error.js";
import { fileURLToPath } from "url";

export default async function collectStatistics(flightData) {
  try {
    console.log(flightData);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const rootDir = resolve(__dirname, "../");

    const statFolderPath = path.join(rootDir, "stat");
    if (!fs.existsSync(statFolderPath)) {
      fs.mkdirSync(statFolderPath);
    }
    const fileName = "flight_statistics.json";
    const filePath = path.join(statFolderPath, fileName);

    let stats = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      stats = JSON.parse(fileContent);
    }

    stats.push(flightData);

    fs.writeFileSync(filePath, JSON.stringify(stats, null, 2), "utf-8");
  } catch (err) {
    logError(err, collectStatistics.name);
  }
}

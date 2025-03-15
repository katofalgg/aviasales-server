import { existsSync, mkdirSync, appendFile } from 'fs';
import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
import logError from './log-error.js';

export default async function logMessage(message) {
  console.log(message);
  const date = new Date().toISOString();
  const currentDate = date.split('T')[0]
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const rootDir = resolve(__dirname, '../');

  const logsFolder = join(rootDir, 'logs-message');
  const logFilePath = join(logsFolder, `${currentDate}.log`);

  const logMessage = `${date} - ${message}\n`;

  if (!existsSync(logsFolder)) {
    mkdirSync(logsFolder);
  }

  appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      logError(err, logMessage.name);
    }
  });
}

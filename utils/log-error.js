import { existsSync, mkdirSync, appendFile } from 'fs';
import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';

const processParams = (params) => {
  const list = Object.entries(params).map(([key, value]) => `${key}: ${value}`);
  return list.length ? `Parameters: ${list.join(', ')}.` : '';
};

export default async function logError(error, errorPath, params = {}) {
  const date = new Date().toISOString();
  const currentDate = date.split('T')[0]
  const parameters = processParams(params);
  const message = `Error: ${error.message ?? error} in ${errorPath}. ${parameters}`;
  console.error('\x1b[31m%s\x1b[0m', message);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const rootDir = resolve(__dirname, '../');

  const logsFolder = join(rootDir, 'logs-error');
  const logFilePath = join(logsFolder, `${currentDate}.log`);

  const logMessage = `${date} - ${message}\n`;

  if (!existsSync(logsFolder)) {
    mkdirSync(logsFolder);
  }

  appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error recording error:', err);
    }
  });
}

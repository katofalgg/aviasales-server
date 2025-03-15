import { configDotenv } from "dotenv";
configDotenv();

export const config = {
  aviasalesToken: process.env.AVIASALES_TOKEN,
  telegramToken: process.env.TELEGRAM_TOKEN,
  telegramChatId: process.env.CHAT_ID,
};

export const searchParams = {
  maxPrice: 20000,
  maxTransferTime: 300,
  origin: "ICN",
  destination: "KZN",
  currency: "RUB",
  departDateFrom: "2025-06-06",
  departDateTo: "2025-06-09",
};

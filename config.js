import { configDotenv } from "dotenv";
configDotenv();

export const config = {
  aviasalesToken: process.env.AVIASALES_TOKEN,
  telegramToken: process.env.TELEGRAM_TOKEN,
  telegramChatId: process.env.CHAT_ID,
};

export const searchParams = {
  maxPrice: 10000,
  maxTransferTime: 360,
  origin: "SHA",
  destination: "DAD",
  currency: "RUB",
  departDateFrom: "2026-01-24",
  departDateTo: "2026-01-24",
};

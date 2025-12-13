import { configDotenv } from "dotenv";
configDotenv();

export const config = {
  aviasalesToken: process.env.AVIASALES_TOKEN,
  telegramToken: process.env.TELEGRAM_TOKEN,
  telegramChatId: process.env.CHAT_ID,
};

//change here
export const searchParams = {
  maxPrice: 11000,
  maxTransferTime: 360,
  origin: "SHA",
  destination: "DAD",
  currency: "RUB",
  departDateFrom: "2026-01-24",
  departDateTo: "2026-01-24",
};

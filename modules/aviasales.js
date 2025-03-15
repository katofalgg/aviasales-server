import { config, searchParams } from "../config.js";
import collectStatistics from "../utils/collect-statistics.js";
import logError from "../utils/log-error.js";
import sendMessage from "./telegram.js";

const SEARCH_URL =
  "https://api.travelpayouts.com/aviasales/v3/prices_for_dates";

export const BASE_URL = "https://www.aviasales.ru";

export default async function searchTickets(departDate) {
  const { aviasalesToken: token } = config;
  const { maxPrice, destination, currency, origin, maxTransferTime } =
    searchParams;

  const params = new URLSearchParams({
    origin,
    destination,
    departure_at: departDate,
    currency,
    token,
  });
  const URL = `${SEARCH_URL}?${params.toString()}`;
  try {
    const res = await fetch(URL);
    if (res?.status === 200) {
      const data = await res.json();

      if (!data?.data?.length) return null;
      const cheapest = data.data[0];
      const transfers_time = cheapest.duration - cheapest.duration_to;

      if (cheapest.price <= maxPrice && transfers_time <= maxTransferTime) {
        const result = {
          ...searchParams,
          departDate,
          price: cheapest.price,
          link: BASE_URL + cheapest.link,
          transfers: cheapest.transfers,
          transfers_time,
        };
        const chatIds = config.telegramChatId.split(",").map(Number);
        for (const id of chatIds) {
          await sendMessage(result, id);
        }
        return;
      } else {
        const currentDate = new Date();
        await collectStatistics({
          ...cheapest,
          currentDate,
        });
        return;
      }
    } else {
      throw new Error(`Request failed. Status: ${res.status}`);
    }
  } catch (err) {
    logError(err, searchTickets.name);
  }
}

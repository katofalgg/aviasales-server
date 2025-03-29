import { config } from "../config.js";
import formatDate from "../utils/format-date.js";
import logError from "../utils/log-error.js";
import logMessage from "../utils/log-message.js";
import getJoke from "./jokes.js";

const statMessage = async (ticket, hours, minutes) => {
  const joke = await getJoke();
  return (
    `*Никуда вы пока не летите! 🤡*\n\n` +
    `📊 *Но у меня есть для тебя статистика и анекдот (в конце):* \n\n` +
    `🎟 *Лучший найденный билет на сегодня:*\n\n` +
    `📍 *Откуда:* ${ticket.origin}\n` +
    `📍 *Куда:* ${ticket.destination}\n` +
    `📅 *Дата вылета:* ${formatDate(ticket.departDate)}\n` +
    `💰 *Цена:* ${ticket.price} ${ticket.currency}\n` +
    `✈️ *Пересадки:* ${
      ticket.transfers > 0 ? ticket.transfers : "Без пересадок"
    }\n` +
    `${
      ticket.transfers > 0
        ? `⏳ *Время пересадки:* ${hours} ч. ${minutes} мин.\n`
        : ""
    }` +
    `⚠️ *Этот билет не удовлетворяет всем твоим критериям, но это лучшее предложение за сегодня.*\n\n` +
    `🔗 [Посмотреть билет](${ticket.link})\n\n` +
    joke
  );
};

const successMessage = (ticket, hours, minutes) =>
  `🎟 *Найден дешевый билет!*\n\n` +
  `📍 *Откуда:* ${ticket.origin}\n` +
  `📍 *Куда:* ${ticket.destination}\n` +
  `📅 *Дата вылета:* ${formatDate(ticket.departDate)}\n` +
  `💰 *Цена:* ${ticket.price} ${ticket.currency} (максимальная цена: ${ticket.maxPrice} ${ticket.currency})\n` +
  `✈️ *Пересадки:* ${
    ticket.transfers > 0 ? ticket.transfers : "Без пересадок"
  }\n` +
  `${
    ticket.transfers > 0
      ? `⏳ *Время пересадки:* ${hours} ч. ${minutes} мин.`
      : ""
  }\n` +
  `🔗 [Забронировать билет](${ticket.link})`;

const getMessage = async (ticket) => {
  const hours = Math.floor(ticket.transfers_time / 60);
  const minutes = ticket.transfers_time % 60;

  return ticket.stat
    ? await statMessage(ticket, hours, minutes)
    : successMessage(ticket, hours, minutes);
};

export default async function sendMessage(resultParams, chat_id) {
  const { telegramToken: token } = config;
  const URL = `https://api.telegram.org/bot${token}/sendMessage`;
  const text = await getMessage(resultParams);
  const body = {
    chat_id,
    text,
    parse_mode: "Markdown",
  };

  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      logMessage("Message successfully sent");
      return;
    } else {
      throw new Error(`Failed to send message. Status: ${res.status}`);
    }
  } catch (err) {
    logError(err, sendMessage.name);
  }
}

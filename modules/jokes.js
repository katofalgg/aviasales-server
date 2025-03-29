import logError from "../utils/log-error.js";

export const BASE_URL = "https://v2.jokeapi.dev/joke/Any?type=single";

export default async function getJoke() {
  try {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    const joke = data.joke ? data.joke : `${data.setup} - ${data.delivery}`;
    return `😂 *Анекдот:* ${joke}\n`;
  } catch (err) {
    logError(err, getJoke.name);
    return `Сегодня без анекдотов, бро 😢\n`;
  }
}

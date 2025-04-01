import logError from "../utils/log-error.js";
import fs from "fs/promises";

export const BASE_URL = "https://v2.jokeapi.dev/joke/Any?type=single";
const jokesFile = "./jokes/jokes.json";

export default function getJoke() {
  try {
    const joke = jokesList.pop();
    return joke ? `😂 *Анекдот:* ${joke}\n` : `Анекдоты кончились, бро 😢\n`;
  } catch (err) {
    logError(err, getJoke.name);
    return `Сегодня без анекдотов, бро 😢\n`;
  }
}

export async function setJokesData() {
  try {
    const jokesData = await fs.readFile(jokesFile, "utf-8");
    jokesList = JSON.parse(jokesData);
  } catch (err) {
    logError(err, setJokesData.name);
  }
}

export let jokesList = [];

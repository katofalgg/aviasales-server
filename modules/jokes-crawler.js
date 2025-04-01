import { JSDOM } from "jsdom";
import fs from "fs/promises";
import logError from "../utils/log-error.js";
const BASE_URL =
  "https://www.anekdot.ru/author-best/years/?years=anekdot&page=";
const jokesFile = "./jokes/jokes.json";

const processHTML = (html) => {
  const anecdotes = [];
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const topicboxes = document.querySelectorAll(".topicbox");

    topicboxes.forEach((box) => {
      const text = box.querySelector(".text")?.textContent.trim();
      if (text) {
        anecdotes.push(text);
      }
    });
    return anecdotes;
  } catch (err) {
    logError(err, processHTML.name);
    return anecdotes;
  }
};

export default async function crawlJokes() {
  const maxPage = 10;
  const jokes = [];
  try {
    for (let page = 1; page <= maxPage; page++) {
      const url = BASE_URL + page;
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      });
      const html = await response.text();
      const jokesFromPage = processHTML(html);
      if (jokesFromPage.length) {
        jokes.push(...jokesFromPage);
      }
    }
    if (jokes.length > 0) {
      await fs.writeFile(jokesFile, JSON.stringify(jokes, null, 2), "utf-8");
    }
  } catch (err) {
    logError(err, crawlJokes.name);
  }
}

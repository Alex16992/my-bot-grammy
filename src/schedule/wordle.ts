import type { Bot } from "grammy";
import cron from "node-cron";
import type { BotContext } from "../types.js";
import prisma from "../prisma.js";
import { RUWORDS } from "../russian.js";

export const wordleSchedule = (bot: Bot<BotContext>) => {
  cron.schedule(
    "0 11 * * *",
    async () => {
      console.log("Задача сработала:", new Date().toISOString());
      const groupID = "-1002352664972";
      const randomWord = RUWORDS[Math.floor(Math.random() * RUWORDS.length)];

      if (!randomWord) {
        console.error("Ошибка генерации слова");
        return;
      }

      try {
        await prisma.wordle.create({
          data: { answer: randomWord },
        });

        await bot.api.sendMessage(groupID, "Новое ежедневное слово создано!");
      } catch (err) {
        console.error("Ошибка отправки в чат", groupID, err);
      }
    },
    { timezone: "Europe/Moscow" }
  );
};

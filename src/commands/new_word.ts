import type { Bot } from "grammy";
import prisma from "../prisma.js";
import { RUWORDS } from "../russian.js";
import type { BotContext } from "../types.js";

export const newWordCommand = (bot: Bot<BotContext>) => {
  bot.command("new_word", async (ctx: BotContext) => {
    const groupID = "-1002352664972";
    const randomWord = RUWORDS[Math.floor(Math.random() * RUWORDS.length)];

    if (!randomWord) {
      console.error("Ошибка генерации слова");
      return;
    }

    try {
      await prisma.wordle.create({
        data: { answer: randomWord.toLowerCase() },
      });

      await ctx.reply("Новое слово создано!");
    } catch (err) {
      console.error("Ошибка отправки в чат", groupID, err);
    }
  });
};

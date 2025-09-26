import type { Bot } from "grammy";
import type { BotContext } from "../types.js";
import { RUWORDS } from "../russian.js";

export const testCommand = (bot: Bot<BotContext>) => {
  bot.command("test", async (ctx: BotContext) => {
    const randomWord = RUWORDS[Math.floor(Math.random() * RUWORDS.length)];
    ctx.reply(randomWord || "Ошибка при генерации слова");
    console.log(ctx.update.message?.chat);
  });
};

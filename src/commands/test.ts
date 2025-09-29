import type { Bot } from "grammy";
import { RUWORDS } from "../russian.js";
import type { BotContext } from "../types.js";

export const testCommand = (bot: Bot<BotContext>) => {
  bot.command("test", async (ctx: BotContext) => {
    console.log(ctx);
    const randomWord = RUWORDS[Math.floor(Math.random() * RUWORDS.length)];
    ctx.reply(randomWord || "Ошибка при генерации слова");
    console.log(ctx.update.message?.chat);
  });
};

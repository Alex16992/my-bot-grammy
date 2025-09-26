import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const urlFilter = (bot: Bot<BotContext>) => {
  bot.on("message:entities:url", async (ctx: BotContext) => {
    await ctx.reply("Найдена ссылка в сообщении!");
  });
};

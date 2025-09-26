import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const skibidiHears = (bot: Bot<BotContext>) => {
  bot.hears(/Чем глубже в лес.../, async (ctx: BotContext) => {
    await ctx.reply("Скибиди доп доп ес ес...");
  });
};

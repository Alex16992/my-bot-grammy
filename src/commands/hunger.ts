import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const hungerCommand = (bot: Bot<BotContext>) => {
  bot.command("hunger", async (ctx: BotContext) => {
    const count = ctx.session.pizzaCount;
    await ctx.reply(`Ваш уровень голода ${count}!`);
  });
};

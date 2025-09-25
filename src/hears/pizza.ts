import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const pizzaHears = (bot: Bot<BotContext>) => {
  bot.hears(/.*🍕.*/, (ctx: BotContext) => ctx.session.pizzaCount++);
};

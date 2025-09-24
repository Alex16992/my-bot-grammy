import type { BotContext } from "../types.js";

export const pizzaHears = (bot: any) => {
  bot.hears(/.*🍕.*/, (ctx: BotContext) => ctx.session.pizzaCount++);
};

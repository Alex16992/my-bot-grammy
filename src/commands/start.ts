import type { BotContext } from "../types.js";

export const startCommand = (bot: any) => {
  bot.command("start", (ctx: BotContext) => {
    ctx.reply("Welcome! Up and running.");
  });
};

import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const rpsCommand = (bot: Bot<BotContext>) => {
  bot.command("rps", async (ctx) => {
    await ctx.conversation.enter("rps");
  });
};

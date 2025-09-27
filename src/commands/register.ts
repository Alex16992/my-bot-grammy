import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const registerCommand = (bot: Bot<BotContext>) => {
  bot.command("register", async (ctx) => {
    await ctx.conversation.enter("register");
  });
};

import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const replyHears = (bot: Bot<BotContext>) => {
  bot.hears(/@test_bot *(.+)?/, async (ctx: BotContext) => {
    const message = ctx.match?.[1] || "...";
    await ctx.reply("You say: " + message);
  });
};

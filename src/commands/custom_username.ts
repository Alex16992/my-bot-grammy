import type { Bot } from "grammy";
import type { BotContext } from "../types";

export const customUsernameCommand = (bot: Bot<BotContext>) => {
  bot.command("customUsername", async (ctx: BotContext) => {
    await ctx.conversation.enter("customUsername");
    await ctx.answerCallbackQuery();
  });
};

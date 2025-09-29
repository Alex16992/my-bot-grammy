import type { Bot } from "grammy";
import { editProfile } from "../helpers/profileHelper.js";
import type { BotContext } from "../types";

export const profileCallback = (bot: Bot<BotContext>) => {
  bot.callbackQuery("profile", async (ctx) => {
    await editProfile(ctx);
    await ctx.answerCallbackQuery();
  });
};

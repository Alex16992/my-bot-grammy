import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const savePhotoCommand = (bot: Bot<BotContext>) => {
  bot.command("save_photo", async (ctx) => {
    await ctx.conversation.enter("savePhoto");
  });
};

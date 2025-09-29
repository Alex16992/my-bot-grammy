import { Bot, InputFile } from "grammy";
import type { BotContext } from "../types.js";

export const photoCommand = (bot: Bot<BotContext>) => {
  bot.command("photo", async (ctx) => {
    await ctx.replyWithPhoto(new InputFile("src/image/image.png"), {
      caption: "Ваше сохраненое фото",
    });
  });
};

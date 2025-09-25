import type { Bot } from "grammy";
import { cryptoMenu } from "../menu/cryptoMenu.js";
import type { BotContext } from "../types.js";

export const cryptoCommand = (bot: Bot<BotContext>) => {
  bot.command("crypto", async (ctx: BotContext) => {
    await ctx.reply("Выберите крипту:", { reply_markup: await cryptoMenu() });
  });
};

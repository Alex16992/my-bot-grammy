import { cryptoMenu } from "../menu/cryptoMenu.js";
import type { BotContext } from "../types.js";

export const cryptoCommand = (bot: any) => {
  bot.command("crypto", async (ctx: BotContext) => {
    await ctx.reply("Выберите крипту:", { reply_markup: cryptoMenu });
  });
};

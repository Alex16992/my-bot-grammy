import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const testCommand = (bot: Bot<BotContext>) => {
  bot.command("test", async (ctx: BotContext) => {
    const statusMessage = await ctx.reply("Wait...");

    setTimeout(() => {
      // Используем плагин гидратации
      statusMessage.editText("Tested!").catch(() => {});
    }, 3000);
  });
};

import type { BotContext } from "../types.js";

import prisma from "../prisma.js";
import type { Bot } from "grammy";

export const steamResetCallback = (bot: Bot<BotContext>) => {
  bot.callbackQuery("steam_reset", async (ctx) => {
    const user = ctx.user;
    const steam_id = user?.steam_id;

    if (!steam_id) {
      await ctx.conversation.enter("steam");
      await ctx.answerCallbackQuery();
    } else {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { steam_id: null },
        });
        await ctx.reply(`Ваш Steam ID сброшен.`);
        await ctx.conversation.enter("steam");
      } catch (error) {
        console.log(error);
        await ctx.reply("Произошла ошибка при сбросе Steam ID.");
      }

      await ctx.answerCallbackQuery();
    }
  });
};

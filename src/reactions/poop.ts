import type { Bot } from "grammy";
import prisma from "../prisma.js";
import type { BotContext } from "../types.js";

export const poopReaction = (bot: Bot<BotContext>) => {
  bot.reaction("💩", async (ctx: BotContext) => {
    const userId = ctx?.update?.message_reaction?.user?.id;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { telegramId: String(userId) },
      });

      ctx.reply(
        `${user?.customUsername || user?.username} поставил какашку xD`
      );
    } else {
      ctx.reply("Кто-то поставил какашку xD");
    }
  });
};

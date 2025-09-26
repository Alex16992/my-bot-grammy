import type { Bot } from "grammy";
import type { BotContext } from "../types.js";
import prisma from "../prisma.js";

export const svoHears = (bot: Bot<BotContext>) => {
  bot.hears(/сво/gi, async (ctx: BotContext) => {
    const text = ctx.msg?.text || "";
    const match = text.match(/сво/gi)?.[0];

    if (ctx.msg?.message_id && match) {
      const startIndex = text.indexOf(match);
      const quote = text.slice(startIndex, startIndex + match.length);

      await ctx.reply("ZZZzzzzzzz 😴😴😴");

      if (ctx.from) {
        await prisma.user.update({
          where: { telegramId: ctx.from.id.toString() },
          data: {
            svo_score: {
              increment: 1,
            },
          },
        });
      }
    } else {
      await ctx.reply("ZZZzzzzzzz 😴😴😴");
    }
  });
};

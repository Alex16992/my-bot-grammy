import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const svoHears = (bot: Bot<BotContext>) => {
  bot.hears(/сво/gi, async (ctx: BotContext) => {
    const text = ctx.msg?.text || "";
    const match = text.match(/сво/gi)?.[0];

    if (ctx.msg?.message_id && match) {
      const startIndex = text.indexOf(match);
      const quote = text.slice(startIndex, startIndex + match.length);

      await ctx.reply("ZZZzzzzzzz 😴😴😴", {
        reply_parameters: {
          message_id: ctx.msg.message_id,
          quote: quote,
        },
      });
    } else {
      await ctx.reply("ZZZzzzzzzz 😴😴😴");
    }
  });
};

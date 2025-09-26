import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const replyHears = (bot: Bot<BotContext>) => {
  bot.hears(/@test_bot *(.+)?/, async (ctx: BotContext) => {
    const message = ctx.match?.[1] || "...";

    ctx.msg
      ? await ctx.reply("You say: " + message, {
          reply_parameters: { message_id: ctx.msg.message_id },
        })
      : await ctx.reply("You say: " + message);
    console.log(ctx.update.message);
  });
};

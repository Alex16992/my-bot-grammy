import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const skibidiHears = (bot: Bot<BotContext>) => {
  bot.hears(/Чем глубже в лес.../, async (ctx: BotContext) => {
    const message = ctx.match?.[1] || "...";

    ctx.msg
      ? await ctx.reply("Скибиди доп доп ес ес...", {
          reply_parameters: { message_id: ctx.msg.message_id },
        })
      : await ctx.reply("Скибиди доп доп ес ес...");
  });
};

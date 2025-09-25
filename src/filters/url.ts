import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const urlFilter = (bot: Bot<BotContext>) => {
  bot.on("message:entities:url", async (ctx: BotContext) => {
    ctx.msg
      ? await ctx.reply("Найдена ссылка в сообщении!", {
          reply_parameters: { message_id: ctx.msg.message_id },
        })
      : await ctx.reply("Найдена ссылка в сообщении!");
  });
};

import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const poopReaction = (bot: Bot<BotContext>) => {
  bot.reaction("💩", (ctx: BotContext) => {
    const msgId = ctx?.update?.message_reaction?.message_id;
    const first_name = ctx?.update?.message_reaction?.user?.first_name;

    if (msgId && first_name) {
      ctx.reply(first_name + " поставил какашку xD", {
        reply_parameters: { message_id: msgId },
      });
    } else {
      ctx.reply("Кто-то поставил какашку xD");
    }
  });
};

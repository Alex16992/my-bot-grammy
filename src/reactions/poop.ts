import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const poopReaction = (bot: Bot<BotContext>) => {
  bot.reaction("💩", (ctx: BotContext) => {
    const first_name = ctx?.update?.message_reaction?.user?.first_name;

    if (first_name) {
      ctx.reply(`${first_name} поставил какашку xD`);
    } else {
      ctx.reply("Кто-то поставил какашку xD");
    }
  });
};

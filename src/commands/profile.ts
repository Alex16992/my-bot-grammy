import type { Bot } from "grammy";
import { sendProfile } from "../helpers/profileHelper.js";
import type { BotContext } from "../types.js";

export const profileCommand = (bot: Bot<BotContext>) => {
  bot.command("profile", async (ctx: BotContext) => {
    await sendProfile(ctx);
  });
};

import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const profileCommand = (bot: Bot<BotContext>) => {
  bot.command("profile", async (ctx: BotContext) => {
    if (!ctx.user) {
      return ctx.reply("Пользователь не найден в системе");
    }
    ctx.reply(
      `ID: ${ctx.user.id}\nTelegram ID: ${ctx.user.telegramId}\nUsername: ${
        ctx.user.username || "не указан"
      }\nБаланс: ${
        ctx.user.balance
      } биткоинов\nДата регистрации: ${ctx.user.createdAt.toLocaleDateString()}`
    );
  });
};

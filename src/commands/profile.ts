import type { BotContext } from "../types.js";

export const profileCommand = (bot: any) => {
  bot.command("profile", async (ctx: BotContext) => {
    if (!ctx.user) {
      return ctx.reply("Пользователь не найден в системе");
    }

    const msgId = ctx?.update?.message?.message_id;

    msgId
      ? ctx.reply(
          `ID: ${ctx.user.id}\nTelegram ID: ${ctx.user.telegramId}\nUsername: ${
            ctx.user.username || "не указан"
          }\nБаланс: ${
            ctx.user.balance
          } биткоинов\nДата регистрации: ${ctx.user.createdAt.toLocaleDateString()}`,
          {
            reply_parameters: { message_id: msgId },
          }
        )
      : ctx.reply(
          `ID: ${ctx.user.id}\nTelegram ID: ${ctx.user.telegramId}\nUsername: ${
            ctx.user.username || "не указан"
          }\nБаланс: ${
            ctx.user.balance
          } биткоинов\nДата регистрации: ${ctx.user.createdAt.toLocaleDateString()}`
        );
  });
};

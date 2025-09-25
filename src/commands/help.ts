import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const helpCommand = (bot: Bot<BotContext>) => {
  bot.command("helpme", async (ctx: BotContext) => {
    await ctx.reply(
      "Мои основные команды:\n/helpme - Список команд\n/crypto - Курс криптовалют\n/test - Тест\n/profile - Показать ваш профиль\nПри упоминании @test_bot я повторю сообщение\nЯ реагирую на реакцию 💩 в чате\nТак же я нахожу ссылки в сообщениях"
    );
  });
};

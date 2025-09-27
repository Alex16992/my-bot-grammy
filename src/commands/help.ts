import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const helpCommand = (bot: Bot<BotContext>) => {
  bot.command("helpme", async (ctx: BotContext) => {
    await ctx.reply(
      `Мои основные команды:
/helpme - Список команд
/rps - Камень, ножницы, бумага
/word - Угадай слово
/score - Показать очки
/crypto - Курс криптовалют
/test - Тест
/profile - Показать ваш профиль

При упоминании @test_bot я повторю сообщение
Я реагирую на реакцию 💩 в чате
Так же я нахожу ссылки в сообщениях`
    );
  });
};

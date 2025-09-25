import type { Bot } from "grammy";
import type { BotContext } from "../types.js";

export const listCommand = async (bot: Bot<BotContext>) => {
  await bot.api.setMyCommands([
    { command: "register", description: "Зарегистрироваться" },
    { command: "profile", description: "Показать профиль" },
    { command: "start", description: "Запустить бота" },
    { command: "helpme", description: "Показать текст для справки" },
    { command: "test", description: "Тестовая команда" },
    { command: "crypto", description: "Курс криптовалют" },
    { command: "hunger", description: "Показать уровень голода" },
  ]);
};

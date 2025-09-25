import type { Bot } from "grammy";
import { listCommand } from "../commands/list.js";
import type { BotContext } from "../types.js";

export const startBot = async (bot: Bot<BotContext>) => {
  bot.start({
    allowed_updates: [
      "message",
      "message_reaction",
      "message_reaction_count",
      "callback_query", // Нужен для кнопок меню
    ],
  });
  // Список команд
  listCommand(bot);
};

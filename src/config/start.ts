import { listCommand } from "../commands/list.js";

export const startBot = async (bot: any) => {
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

import type { Bot } from "grammy";
import cron from "node-cron";
import { checkAllUsersWithSteamId } from "../helpers/steamScheduleHelper.js";
import type { BotContext } from "../types";

export const steamGameSchedule = (bot: Bot<BotContext>) => {
  cron.schedule(
    "* * * * *",
    async () => {
      console.log("Запуск проверки Steam данных:", new Date().toISOString());
      try {
        await checkAllUsersWithSteamId(bot);
      } catch (error) {
        console.error("Ошибка при выполнении проверки Steam данных:", error);
      }
    },
    { timezone: "Europe/Moscow" }
  );
};

import type { Bot } from "grammy";
import prisma from "../prisma.js";
import type { BotContext } from "../types.js";

export const scoreCommand = (bot: Bot<BotContext>) => {
  bot.command("score", async (ctx: BotContext) => {
    const userName = ctx.match?.toString().substring(1) || null;
    let svoScore = 0;
    let wordleScore = 0;
    let customUsername = "";

    if (!ctx.user || !ctx.from) {
      return ctx.reply("Пользователь не найден в системе");
    }

    if (!userName) {
      const user = await prisma.user.findUnique({
        where: { telegramId: ctx.from.id.toString() },
      });
      svoScore = user?.svo_score || 0;
      wordleScore = user?.wordle_score || 0;
      customUsername = user?.customUsername || "";
    } else {
      const user = await prisma.user.findUnique({
        where: { username: userName },
      });
      svoScore = user?.svo_score || 0;
      wordleScore = user?.wordle_score || 0;
      customUsername = user?.customUsername || "";
    }

    if (!userName) {
      ctx.reply(
        `Очки СВО у вас: ${ctx.user.svo_score}\nОчки Wordle у вас: ${ctx.user.wordle_score}`
      );
    } else {
      ctx.reply(
        `Очки СВО у ${customUsername !== "" ? customUsername : userName}: ${svoScore}\nОчки Wordle у ${customUsername !== "" ? customUsername : userName}: ${wordleScore}`
      );
    }
  });
};

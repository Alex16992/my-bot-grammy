import type { Bot } from "grammy";
import type { BotContext } from "../types.js";
import prisma from "../prisma.js";

export const scoreCommand = (bot: Bot<BotContext>) => {
  bot.command("score", async (ctx: BotContext) => {
    const username = ctx.match?.toString().substring(1) || null;
    let svoScore = 0;
    let wordleScore = 0;

    if (!ctx.user || !ctx.from) {
      return ctx.reply("Пользователь не найден в системе");
    }

    if (!username) {
      const user = await prisma.user.findUnique({
        where: { telegramId: ctx.from.id.toString() },
      });
      svoScore = user?.svo_score || 0;
      wordleScore = user?.wordle_score || 0;
    } else {
      const user = await prisma.user.findUnique({ where: { username } });
      svoScore = user?.svo_score || 0;
      wordleScore = user?.wordle_score || 0;
    }

    const _msgId = ctx?.update?.message?.message_id;

    if (!username) {
      ctx.reply(
        `Очки СВО у вас: ${ctx.user.svo_score}\nОчки Wordle у вас: ${ctx.user.wordle_score}`
      );
    } else {
      ctx.reply(
        `Очки СВО у ${username}: ${svoScore}\nОчки Wordle у ${username}: ${wordleScore}`
      );
    }
  });
};

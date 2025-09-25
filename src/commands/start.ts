import prisma from "../prisma.js";
import type { BotContext } from "../types.js";

export const startCommand = (bot: any) => {
  bot.command("start", async (ctx: BotContext) => {
    if (!ctx.from)
      return ctx.reply(
        "Не удалось создать пользователя, попробуйте - /register"
      );

    await prisma.user.upsert({
      where: { telegramId: ctx.from.id.toString() },
      update: {},
      create: {
        telegramId: ctx.from.id.toString(),
        username: ctx.from.username ?? null,
      },
    });

    const userDB = await prisma.user.findUnique({
      where: { telegramId: ctx.from.id.toString() },
    });

    ctx.reply(`Привет ${userDB?.username}!`);
  });
};

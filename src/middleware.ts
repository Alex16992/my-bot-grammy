import type { Bot } from "grammy";
import prisma from "./prisma.js";
import type { BotContext } from "./types.js";

// Middleware для проверки и регистрации пользователя
export const Middleware = (bot: Bot<BotContext>) => {
  bot.use(async (ctx: BotContext, next: any) => {
    if (!ctx.from) {
      return await next();
    }

    let userDB = await prisma.user.findUnique({
      where: { telegramId: ctx.from.id.toString() },
    });

    if (!userDB) {
      try {
        await prisma.user.upsert({
          where: { telegramId: ctx.from.id.toString() },
          update: {},
          create: {
            telegramId: ctx.from.id.toString(),
            username: ctx.from.username ?? null,
          },
        });

        userDB = await prisma.user.findUnique({
          where: { telegramId: ctx.from.id.toString() },
        });

        if (userDB) {
          await ctx.reply(
            `Пользователь ${userDB.username || "без username"} зарегистрирован!`
          );
        }
      } catch (error) {
        console.error("Ошибка при регистрации пользователя:", error);
        await ctx.reply("Не удалось создать пользователя, попробуйте позже");
      }
    } else {
      await prisma.user.update({
        where: { telegramId: ctx.from.id.toString() },
        data: { username: ctx.from.username ?? null },
      });
    }

    // Добавляем информацию о пользователе в контекст
    ctx.user = userDB;

    // Продолжаем выполнение других обработчиков
    await next();
  });
};

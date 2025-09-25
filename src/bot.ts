import "dotenv/config";
import { Bot } from "grammy";
import {
  cryptoCommand,
  helpCommand,
  hungerCommand,
  startCommand,
  testCommand,
} from "./commands/index.js";
import { urlFilter } from "./filters/index.js";
import { pizzaHears, replyHears, skibidiHears } from "./hears/index.js";
import { poopReaction } from "./reactions/poop.js";
import type { BotContext } from "./types.js";
import { pizzaSession } from "./session/pizzaSession.js";
import { startBot } from "./config/start.js";
import { hydrate } from "@grammyjs/hydrate";
import { cryptoCallback } from "./callback/crypto.js";
import { errorHandling } from "./errors/error.js";
import prisma from "./prisma.js";
import { profileCommand } from "./commands/profile.js";

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot<BotContext>(process.env.BOT_TOKEN as string);
bot.use(hydrate());

// Middleware для проверки и регистрации пользователя
bot.use(async (ctx, next) => {
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
  }

  // Добавляем информацию о пользователе в контекст
  ctx.user = userDB;

  // Продолжаем выполнение других обработчиков
  await next();
});

// Сессии
pizzaSession(bot);

// Команды
profileCommand(bot);
cryptoCommand(bot);
helpCommand(bot);
startCommand(bot);
testCommand(bot);
hungerCommand(bot);

// Фильтры
urlFilter(bot);

// Слушатели
skibidiHears(bot);
replyHears(bot);
pizzaHears(bot);

// Callbacks
cryptoCallback(bot);

// Реакции
poopReaction(bot);

// Ошибки
errorHandling(bot);

// Start the bot.
startBot(bot);

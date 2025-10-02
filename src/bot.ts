import "dotenv/config";
import { conversations, createConversation } from "@grammyjs/conversations";
import { hydrate } from "@grammyjs/hydrate";
import { limit } from "@grammyjs/ratelimiter";
import { PrismaAdapter } from "@grammyjs/storage-prisma";
import { PrismaClient } from "@prisma/client";
import { autoQuote } from "@roziscoding/grammy-autoquote";
import { Bot, session } from "grammy";

import {
  cryptoCallback,
  profileCallback,
  steamCallback,
  steamResetCallback,
} from "./callback/index.js";

import {
  cryptoCommand,
  helpCommand,
  hungerCommand,
  newWordCommand,
  photoCommand,
  profileCommand,
  registerCommand,
  rpsCommand,
  savePhotoCommand,
  scoreCommand,
  startCommand,
  testCommand,
  wordCommand,
} from "./commands/index.js";

import { startBot } from "./config/start.js";

import {
  register,
  rps,
  savePhoto,
  steam,
  write_word,
} from "./conversations/index.js";

import { errorHandling } from "./errors/error.js";

import { urlFilter } from "./filters/index.js";

import {
  pizzaHears,
  replyHears,
  skibidiHears,
  svoHears,
} from "./hears/index.js";

import { Middleware } from "./middleware.js";

import { poopReaction } from "./reactions/poop.js";
import { steamGameSchedule } from "./schedule/steamGame.js";
import { wordleSchedule } from "./schedule/wordle.js";
import type { BotContext } from "./types.js";

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot<BotContext>(process.env.BOT_TOKEN as string);

const prisma = new PrismaClient();

bot.use(hydrate(), autoQuote());

bot.use(
  session({
    initial: () => ({
      word: "",
      pizzaCount: 0,
      userName: "",
      userPhoto: "",
      userMeme: "",
      userId: 0,
      rpsStarted: false,
      rps_bot_answer: "",
    }),
    storage: new PrismaAdapter(prisma.session),
  })
);

// Антифлуд
bot.use(
  limit({
    // Разрешите обрабатывать только 3 сообщения каждые 2 секунды.
    timeFrame: 2000,
    limit: 3,

    // Эта функция вызывается при превышении лимита.
    // onLimitExceeded: async (ctx) => {
    //   await ctx.reply(
    //     "Пожалуйста, воздержитесь от отправки слишком большого количества сообщений!"
    //   );
    // },

    keyGenerator: (ctx) => {
      return ctx.update.message
        ? ctx.update.message.from?.id.toString()
        : ctx.from?.id.toString();
    },
  })
);

// Middleware
Middleware(bot);

bot.use(conversations());

bot.use(createConversation(register));
bot.use(createConversation(write_word));
bot.use(createConversation(rps));
bot.use(createConversation(savePhoto));
bot.use(createConversation(steam));

// Команды
registerCommand(bot);
profileCommand(bot);
cryptoCommand(bot);
helpCommand(bot);
startCommand(bot);
testCommand(bot);
hungerCommand(bot);
scoreCommand(bot);
wordCommand(bot);
newWordCommand(bot);
rpsCommand(bot);
savePhotoCommand(bot);
photoCommand(bot);

// scheduler
wordleSchedule(bot);
steamGameSchedule(bot);

// Фильтры
urlFilter(bot);

// Слушатели
skibidiHears(bot);
replyHears(bot);
pizzaHears(bot);
svoHears(bot);

// Callbacks
cryptoCallback(bot);
steamCallback(bot);
steamResetCallback(bot);
profileCallback(bot);

// Реакции
poopReaction(bot);

// Ошибки
errorHandling(bot);

// Start the bot.
startBot(bot);

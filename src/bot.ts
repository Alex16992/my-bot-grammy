import "dotenv/config";
import { Bot, InputFile, session } from "grammy";
import {
  cryptoCommand,
  helpCommand,
  hungerCommand,
  startCommand,
  testCommand,
  profileCommand,
  newWordCommand,
  rpsCommand,
  scoreCommand,
  wordCommand,
} from "./commands/index.js";
import { urlFilter } from "./filters/index.js";
import { pizzaHears, replyHears, skibidiHears } from "./hears/index.js";
import { poopReaction } from "./reactions/poop.js";
import type { BotContext } from "./types.js";
import { startBot } from "./config/start.js";
import { hydrate } from "@grammyjs/hydrate";
import { cryptoCallback } from "./callback/crypto.js";
import { errorHandling } from "./errors/error.js";
import { svoHears } from "./hears/svo.js";
import { Middleware } from "./middleware.js";
import { autoQuote } from "@roziscoding/grammy-autoquote";
import { wordleSchedule } from "./schedule/wordle.js";
import { conversations, createConversation } from "@grammyjs/conversations";
import { write_word } from "./conversations/write_word.js";
import { rps } from "./conversations/rps.js";
import { savePhoto } from "./conversations/savePhoto.js";
import { limit } from "@grammyjs/ratelimiter";
import { register } from "./conversations/register.js";
import { PrismaClient } from "@prisma/client";
import { registerCommand } from "./commands/register.js";
import { PrismaAdapter } from "@grammyjs/storage-prisma";
import { steamCallback } from "./callback/steam.js";
import { steam } from "./conversations/steam.js";
import { steamResetCallback } from "./callback/steam_reset.js";

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
    // Разрешите обрабатывать только 1 сообщения каждую секунду.
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

bot.command("photo", async (ctx) => {
  await ctx.replyWithPhoto(new InputFile("src/image/image.png"), {
    caption: "Ваше сохраненое фото",
  });
});

bot.command("save_photo", async (ctx) => {
  await ctx.conversation.enter("savePhoto");
});

// scheduler
wordleSchedule(bot);

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

// Реакции
poopReaction(bot);

// Ошибки
errorHandling(bot);

// Start the bot.
startBot(bot);

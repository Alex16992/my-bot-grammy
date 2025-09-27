import "dotenv/config";
import { Bot, Context, session } from "grammy";
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
import type { BotContext, SessionData } from "./types.js";
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
import { limit } from "@grammyjs/ratelimiter";

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot<BotContext>(process.env.BOT_TOKEN as string);

function initial(): SessionData {
  return { word: "", pizzaCount: 0 };
}

bot.use(hydrate(), autoQuote(), session({ initial }), conversations());

bot.use(
  limit({
    // Разрешите обрабатывать только 1 сообщения каждую секунду.
    timeFrame: 1000,
    limit: 1,

    // Эта функция вызывается при превышении лимита.
    onLimitExceeded: async (ctx) => {
      await ctx.reply(
        "Пожалуйста, воздержитесь от отправки слишком большого количества запросов!"
      );
    },

    // Обратите внимание, что ключ должен быть числом в строковом формате, например «123456789».
    keyGenerator: (ctx) => {
      return ctx.from?.id.toString();
    },
  })
);

bot.use(createConversation(write_word));
bot.use(createConversation(rps));

// Middleware
Middleware(bot);

// Команды
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

// Реакции
poopReaction(bot);

// Ошибки
errorHandling(bot);

// Start the bot.
startBot(bot);

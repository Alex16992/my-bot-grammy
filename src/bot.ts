import "dotenv/config";
import { Bot } from "grammy";
import {
  cryptoCommand,
  helpCommand,
  hungerCommand,
  startCommand,
  testCommand,
  profileCommand,
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
import { svoHears } from "./hears/svo.js";
import { Middleware } from "./middleware.js";
import { scoreCommand } from "./commands/score.js";
import { wordCommand } from "./commands/word.js";
import { newWordCommand } from "./commands/new_word.js";

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot<BotContext>(process.env.BOT_TOKEN as string);
bot.use(hydrate());

// Middleware
Middleware(bot);

// Сессии
pizzaSession(bot);

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

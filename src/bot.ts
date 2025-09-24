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

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot<BotContext>(process.env.BOT_TOKEN as string); // <-- put your bot token between the ""
bot.use(hydrate());
// Сессии
pizzaSession(bot);

// Команды
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

// Реакции
poopReaction(bot);

bot.on(":photo", async (ctx) => {
  const statusMessage = await ctx.reply("Processing your image, please wait");
  await statusMessage.delete(); // so easy!
});

// Start the bot.
startBot(bot);

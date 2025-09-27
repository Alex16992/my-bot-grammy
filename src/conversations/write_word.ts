import type { Conversation } from "@grammyjs/conversations";
import { processWordLogic } from "../commands/word.js";
import type { BotContext } from "../types.js";

export async function write_word(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  await ctx.reply("Напишите слово или букву в следующем сообщении!");
  const { message } = await conversation.waitFor("message:text");
  const word = message.text.trim().toLowerCase();

  // После получения слова, сразу обрабатываем его как команду /word
  ctx.match = word;

  // Импортируем и вызываем логику обработки слова
  await processWordLogic(ctx, word);
}

import type { Conversation } from "@grammyjs/conversations";
import type { BotContext } from "../types.js";

// rock paper scissors
export async function rps(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const rps = ["/rock", "/scissors", "/paper"];
  await conversation.external(async (ctx) => {
    ctx.session.userId = ctx.from?.id || 0;
  });
  const session = await conversation.external(async (ctx) => ctx.session);
  let sessionUserId = session.userId;
  const currentUserId = ctx.update.message ? ctx.update.message.from?.id : 0; // Сохраняем ID пользователя для проверки
  let answer = "";
  let rpsStarted = session.rpsStarted || false;

  if (sessionUserId !== currentUserId || !rpsStarted) {
    await ctx.reply("Выберите /rock, /paper или /scissors!");
    await conversation.external(async (ctx) => {
      ctx.session.userId = currentUserId;
    });
    rpsStarted = true;
  }

  const { message } = await conversation.waitFor("message:text");

  if (message.from?.id !== sessionUserId)
    return await ctx.reply(
      "Вы вышли из игры или это была не ваша игра! Начать новую игру - /rps"
    );

  answer = message.text.trim().toLowerCase().split("@")[0] || "";

  if (!answer)
    return ctx.reply(
      "Вы вышли из игры или это была не ваша игра! Начать новую игру - /rps"
    );

  if (rps.includes(answer)) {
    await ctx.reply(`Вы выбрали ${answer}`);
    const randomRps = rps[Math.floor(Math.random() * rps.length)];
    await ctx.reply(`Я выбрал ${randomRps}`);

    if (answer === randomRps) {
      await ctx.reply("Ничья!");
    } else if (
      (answer === "/rock" && randomRps === "/scissors") ||
      (answer === "/scissors" && randomRps === "/paper") ||
      (answer === "/paper" && randomRps === "/rock")
    ) {
      await ctx.reply("Вы победили!");
    } else {
      await ctx.reply("Вы проиграли.");
    }
  } else {
    await ctx.reply(
      "Вы вышли из игры или это была не ваша игра! Начать новую игру - /rps"
    );
  }

  await conversation.external(async (ctx) => {
    ctx.session.rpsStarted = false;
  });
}

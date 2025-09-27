import type { Conversation } from "@grammyjs/conversations";
import type { BotContext } from "../types.js";

// rock paper scissors
export async function rps(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const rps = ["/rock", "/scissors", "/paper"];
  await ctx.reply("Выберите /rock, /paper или /scissors!");
  const { message } = await conversation.waitFor("message:text");
  const answer = message.text.trim().toLowerCase().split("@")[0];

  console.log(answer, message);

  if (!answer) return ctx.reply("Вы вышли из игры!");

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
    await ctx.reply("Вы вышли из игры!");
  }
}

import type { Conversation } from "@grammyjs/conversations";
import type { BotContext } from "../types.js";

export async function register(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  await ctx.reply("Отправьте вашу аватарку или пропустите этот шаг - /skip.");
  const { message: photo } = await conversation.waitFor("message");

  console.log(photo.photo);
  console.log("Context: ", ctx);

  if (photo.text) {
    if (photo.text.trim().toLowerCase().split("@")[0] === "/skip") {
      await ctx.reply("Вы пропустили этот шаг.");
    }
  } else if (photo.photo?.[photo.photo.length - 1]?.file_id) {
    // Обновляем сессию через external
    await conversation.external(async (ctx) => {
      ctx.session.userPhoto =
        photo.photo?.[photo.photo.length - 1]?.file_id || "";
    });
    await ctx.reply("Фото получено.");
  } else {
    await ctx.reply("Ошибка при получении фотки.");
  }

  await ctx.reply("Придумайте логин.");
  const { message: login } = await conversation.waitFor("message:text");

  // А так сработает
  await conversation.external(async (ctx) => {
    ctx.session.userName = login.text;
  });

  await ctx.reply("Ваш любимый мем? (текстом)");
  const { message: meme } = await conversation.waitFor("message:text");

  // Обновляем сессию через external
  await conversation.external(async (ctx) => {
    ctx.session.userMeme = meme.text;
  });

  await ctx.reply(
    `Регистрация завершена! Логин: ${login.text}, Мем: ${meme.text}`
  );
}

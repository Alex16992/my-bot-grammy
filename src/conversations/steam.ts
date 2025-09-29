import type { Conversation } from "@grammyjs/conversations";
import type { BotContext } from "../types.js";
import prisma from "../prisma.js";
import axios from "axios";

export async function steam(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const user = await conversation.external(async (ctx) => ctx.user);
  console.log(user);
  if (!user) return ctx.reply("Пользователь не найден в системе");
  await ctx.reply("Пожалуйста, отправьте ваш Steam ID.");
  const { message } = await conversation.waitFor("message:text");

  const steam_id = message.text;

  const { data } = await axios.get(
    `https://playerdb.co/api/player/steam/${steam_id}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (data.error) return ctx.reply("Неверный Steam ID.");

  user.steam_id = steam_id || null;
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { steam_id: user.steam_id },
    });
    await ctx.reply(`Ваш Steam ID сохранён: ${user.steam_id}`);
  } catch (error) {
    console.log(error);
    await ctx.reply("Произошла ошибка при сохранении Steam ID.");
  }
}

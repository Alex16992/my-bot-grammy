import type { Conversation } from "@grammyjs/conversations";
import prisma from "../prisma.js";
import type { BotContext } from "../types.js";

export async function customUsername(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  const user = await conversation.external(async (ctx) => ctx.user);
  console.log(user);
  if (!user) return ctx.reply("Пользователь не найден в системе");
  await ctx.reply("Пожалуйста, укажите ваше новое имя пользователя.");
  const { message } = await conversation.waitFor("message:text");

  const customUsername = message.text;

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { customUsername: customUsername },
    });
    await ctx.reply(`Ваше новое имя пользователя сохранено: ${customUsername}`);
  } catch (error) {
    console.log(error);
    await ctx.reply("Произошла ошибка при сохранении имени пользователя.");
  }
}

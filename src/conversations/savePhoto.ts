import type { Conversation } from "@grammyjs/conversations";
import type { BotContext } from "../types.js";
import { writeFile } from "node:fs/promises";

export async function savePhoto(
  conversation: Conversation<BotContext, BotContext>,
  ctx: BotContext
) {
  await ctx.reply("Отправьте фото, и я сохраню его.");
  const {
    message: { photo },
  } = await conversation.waitFor("message:photo");

  if (!ctx.from) return;

  try {
    const photoFile = photo[photo.length - 1];
    if (!photoFile) return ctx.reply("Ошибка при получении фотки.");
    const file = await ctx.api.getFile(photoFile.file_id);
    const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    await writeFile(`./src/image/image.png`, Buffer.from(buffer));
    await ctx.reply("Фотка сохранена!");
  } catch (err) {
    console.error(err);
    await ctx.reply("Ошибка при сохранении фотки.");
  }
}

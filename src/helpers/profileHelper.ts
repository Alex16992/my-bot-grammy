import { profileMenu } from "../menu/profileMenu.js";
import type { BotContext } from "../types.js";

export const getProfileText = (user: any): string => {
  return `ID: ${user.id}\nTelegram ID: ${user.telegramId}\nUsername: ${
    user.username || "не указан"
  }\nБаланс: ${
    user.balance
  } биткоинов\nДата регистрации: ${user.createdAt.toLocaleDateString()}`;
};

export const getProfileOptions = async (ctx: BotContext) => {
  return {
    reply_markup: await profileMenu(),
    reply_parameters: {
      message_id: ctx.msg ? ctx.msg.message_id : 0,
      allow_sending_without_reply: true,
    },
  };
};

export const sendProfile = async (ctx: BotContext) => {
  if (!ctx.user) {
    return ctx.reply("Пользователь не найден в системе");
  }

  const text = getProfileText(ctx.user);
  const options = await getProfileOptions(ctx);

  return ctx.replyWithPhoto(
    "https://i.pinimg.com/474x/07/c4/72/07c4720d19a9e9edad9d0e939eca304a.jpg",
    {
      caption: text,
      reply_markup: options.reply_markup,
    }
  );
};

export const editProfile = async (ctx: BotContext) => {
  if (!ctx.user) {
    try {
      await ctx.editMessageText("Пользователь не найден в системе");
    } catch {
      // Если не удалось отредактировать текст, удаляем старое и отправляем новое
      try {
        await ctx.deleteMessage();
        await ctx.reply("Пользователь не найден в системе");
      } catch {
        await ctx.reply("Пользователь не найден в системе");
      }
    }
    return;
  }

  const text = getProfileText(ctx.user);
  const options = await getProfileOptions(ctx);

  try {
    // Пытаемся заменить фото на минимальное прозрачное изображение
    await ctx.editMessageMedia(
      {
        type: "photo",
        media:
          "https://i.pinimg.com/474x/07/c4/72/07c4720d19a9e9edad9d0e939eca304a.jpg",
        caption: text,
      },
      {
        reply_markup: options.reply_markup,
      }
    );
  } catch (mediaError) {
    console.log("Не удалось заменить медиа на пустое фото:", mediaError);
    try {
      // Если не получилось, пытаемся отредактировать подпись (для сообщений с фото)
      await ctx.editMessageCaption({
        caption: text,
        ...options,
      });
    } catch (captionError) {
      console.log("Не удалось отредактировать подпись:", captionError);
      try {
        // Если не получилось, пытаемся отредактировать текст сообщения
        await ctx.editMessageText(text, options);
      } catch (textError) {
        console.log("Не удалось отредактировать текст:", textError);
        // Если ничего не сработало, удаляем и отправляем новое
        try {
          await ctx.deleteMessage();
          await ctx.reply(text, options);
        } catch (deleteError) {
          console.log("Не удалось удалить сообщение:", deleteError);
          // В крайнем случае просто отправляем новое сообщение
          await ctx.reply(text, options);
        }
      }
    }
  }
};

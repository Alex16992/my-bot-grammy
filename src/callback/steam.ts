import { InlineKeyboard, type Bot } from "grammy";
import type { BotContext } from "../types.js";
import axios from "axios";

export const steamCallback = (bot: Bot<BotContext>) => {
  bot.callbackQuery("steam", async (ctx) => {
    const steam_id = ctx.user?.steam_id;

    if (!steam_id) {
      await ctx.conversation.enter("steam");
      await ctx.answerCallbackQuery();
    } else {
      const { data } = await axios.get(
        `https://playerdb.co/api/player/steam/${steam_id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const inlineKeyboard = new InlineKeyboard()
        .url("Ссылка на аккаунт", data.data.player.meta.profileurl)
        .row()
        .text("Изменить Steam ID", "steam_reset");

      await ctx.replyWithPhoto(data.data.player.meta.avatarfull, {
        caption: `Ваш Steam ID: ${data.data.player.meta.steamid}
Ваше имя: ${data.data.player.meta.personaname}
Ваша страна: ${data.data.player.meta.loccountrycode}`,
        reply_markup: inlineKeyboard,
      });

      console.log();

      await ctx.answerCallbackQuery();
    }
  });
};

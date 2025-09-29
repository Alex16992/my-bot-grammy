import axios from "axios";
import { type Bot, InlineKeyboard } from "grammy";
import type { BotContext } from "../types.js";

export const steamCallback = (bot: Bot<BotContext>) => {
  bot.callbackQuery("steam", async (ctx) => {
    const steam_id = ctx.user?.steam_id;
    let steamData = "";

    try {
      await ctx.editMessageMedia({
        type: "animation",
        media:
          "https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyd2RzYW4xMHFoN3A3eHlsNnIzNHRpeGFya3I0ZGVlMm5sMHp1bjJiYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oEjI6SIIHBdRxXI40/200w.gif",
        caption: "Ожидаем получение данных...",
      });
      await new Promise((resolve) => setTimeout(resolve, 700));
    } catch (error) {
      console.log("Не удалось отредактировать сообщение:", error);
      await ctx.editMessageCaption({ caption: "Ожидаем получение данных..." });
    }

    if (!steam_id) {
      await ctx.conversation.enter("steam");
      await ctx.answerCallbackQuery();
    } else {
      let userData: any;
      let userRecentlyPlayedGames: any;
      let userGetOwnedGames: any;

      try {
        const { data } = await axios.get(
          `https://playerdb.co/api/player/steam/${steam_id}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        userData = data;
        steamData += `Ваш Steam ID: ${userData.data.player.meta.steamid}
Ваше имя: ${userData.data.player.meta.personaname}
Ваша страна: ${userData.data.player.meta.loccountrycode}`;
        await ctx.editMessageMedia({
          type: "photo",
          media: userData.data.player.meta.avatarfull,
          caption: `${steamData}\nПродожается загрузка...`,
        });
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.log(error);
        await ctx.reply(
          "Произошла ошибка при получении данных о пользователе."
        );
      }

      try {
        const { data } = await axios.get(
          `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${userData.data.player.meta.steamid}&format=json`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        userRecentlyPlayedGames = data;
        steamData += `\n\nВаши последние игры: ${userRecentlyPlayedGames.response.games.map((game: any) => game.name).join(", ")}\n`;
        await ctx.editMessageMedia({
          type: "photo",
          media: userData.data.player.meta.avatarfull,
          caption: `${steamData}\nПродожается загрузка...`,
        });
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.log(error);
        await ctx.reply(
          "Произошла ошибка при получении данных о недавних играх."
        );
      }

      try {
        const { data } = await axios.get(
          `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${userData.data.player.meta.steamid}&format=json`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        userGetOwnedGames = data;
        steamData += `Всего наиграно часов: ${Math.round(
          userGetOwnedGames.response.games
            .map((game: any) => game.playtime_forever)
            .reduce((a: number, b: number) => a + b, 0) / 60
        )}
Всего игр на аккаунте: ${userGetOwnedGames.response.game_count}
`;
        await ctx.editMessageMedia({
          type: "photo",
          media: userData.data.player.meta.avatarfull,
          caption: `${steamData}\nПродожается загрузка...`,
        });
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.log(error);
        await ctx.reply("Произошла ошибка при получении данных о всех играх.");
      }

      const inlineKeyboard = new InlineKeyboard()
        .url("Ссылка на аккаунт", userData.data.player.meta.profileurl)
        .row()
        .text("Изменить Steam ID", "steam_reset")
        .row()
        .text("Назад", "profile");

      await ctx.editMessageMedia(
        {
          type: "photo",
          media: userData.data.player.meta.avatarfull,
          caption: steamData,
        },
        {
          reply_markup: inlineKeyboard,
        }
      );

      await ctx.answerCallbackQuery();
    }
  });
};

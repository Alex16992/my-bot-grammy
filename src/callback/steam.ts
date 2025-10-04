import {
  ISteamUserWrapper,
  type PlayerSummary,
  type SteamId,
} from "@j4ckofalltrades/steam-webapi-ts";
import { type Bot, InlineKeyboard } from "grammy";
import { updateSteamData } from "../helpers/steamHelper.js";
import type { BotContext } from "../types.js";

export const steamCallback = (bot: Bot<BotContext>) => {
  bot.callbackQuery(/steam-(.+)/, async (ctx) => {
    const steam_id = String(ctx.match[1]);
    console.log("Steam ID:", ctx.match);
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
      // Получаем основные данные пользователя
      const userDataResult = await updateSteamData(
        ctx,
        `https://playerdb.co/api/player/steam/${steam_id}`,
        steamData,
        (data) => `Ваш Steam ID: ${data.data.player.meta.steamid}
Ваше имя: ${data.data.player.meta.personaname}
Ваша страна: ${data.data.player.meta.loccountrycode}`,
        "Произошла ошибка при получении данных о пользователе."
        // Получаем аватар после успешного запроса
      );
      const userData = userDataResult.data;
      steamData = userDataResult.updatedData;

      // Обновляем с аватаром
      await ctx.editMessageMedia({
        type: "photo",
        media: userData.data.player.meta.avatarfull,
        caption: `${steamData}\nПродожается загрузка...`,
      });
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Получаем недавние игры
      const recentGamesResult = await updateSteamData(
        ctx,
        `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${userData.data.player.meta.steamid}&format=json`,
        steamData,
        (data) =>
          `\n\nВаши последние игры: ${data.response.games.map((game: any) => game.name).join(", ")}\n`,
        "Произошла ошибка при получении данных о недавних играх.",
        userData.data.player.meta.avatarfull
      );
      steamData = recentGamesResult.updatedData;

      // Получаем все игры
      const ownedGamesResult = await updateSteamData(
        ctx,
        `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${userData.data.player.meta.steamid}&format=json`,
        steamData,
        (data) => `\nВсего наиграно часов: ${Math.round(
          data.response.games
            .map((game: any) => game.playtime_forever)
            .reduce((a: number, b: number) => a + b, 0) / 60
        )}
Всего игр на аккаунте: ${data.response.game_count}
`,
        "Произошла ошибка при получении данных о всех играх.",
        userData.data.player.meta.avatarfull
      );
      steamData = ownedGamesResult.updatedData;

      const playerSummary = async (
        steamids: SteamId[]
      ): Promise<PlayerSummary> => {
        const {
          response: { players },
        } = await new ISteamUserWrapper(
          process.env.STEAM_API_KEY as string
        ).getPlayerSummaries(steamids);
        return players[0] as PlayerSummary;
      };

      const currentGameDetails = async (steamids: SteamId[]) => {
        const { personaname, gameextrainfo } = await playerSummary(steamids);
        return {
          personaname,
          gameextrainfo,
        };
      };

      const gameDetails = await currentGameDetails([
        userData.data.player.meta.steamid,
      ]);

      steamData +=
        gameDetails.gameextrainfo === undefined
          ? "\nСейчас не в игре"
          : `\nСейчас в игре: ${gameDetails.gameextrainfo}`;

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

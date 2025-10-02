import {
  ISteamUserWrapper,
  type PlayerSummary,
  type SteamId,
} from "@j4ckofalltrades/steam-webapi-ts";
import axios from "axios";
import prisma from "../prisma.js";

// Функция для получения последней активности пользователя
export const getLastSteamActivity = async (userId: number) => {
  try {
    const activity = await prisma.steamActivity.findUnique({
      where: { userId },
    });
    return activity;
  } catch (error) {
    console.error(
      `Ошибка при получении активности пользователя ${userId}:`,
      error
    );
    return null;
  }
};

// Функция для создания или обновления активности пользователя
export const updateSteamActivity = async (
  userId: number,
  personaname: string,
  currentGame: string | null
) => {
  try {
    const activity = await prisma.steamActivity.upsert({
      where: { userId },
      update: {
        personaname,
        currentGame,
        lastChecked: new Date(),
      },
      create: {
        userId,
        personaname,
        currentGame,
        lastChecked: new Date(),
      },
    });
    return activity;
  } catch (error) {
    console.error(
      `Ошибка при обновлении активности пользователя ${userId}:`,
      error
    );
    throw error;
  }
};

// Функция для получения всех пользователей с steam_id
export const getUsersWithSteamId = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        steam_id: {
          not: null,
        },
      },
      select: {
        id: true,
        telegramId: true,
        steam_id: true,
        username: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Ошибка при получении пользователей с Steam ID:", error);
    return [];
  }
};

// Функция для получения основных данных пользователя Steam
export const getSteamUserData = async (steamId: string) => {
  try {
    const { data } = await axios.get(
      `https://playerdb.co/api/player/steam/${steamId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return data;
  } catch (error) {
    console.error(
      `Ошибка при получении данных пользователя ${steamId}:`,
      error
    );
    throw error;
  }
};

// Функция для получения информации о текущей игре
export const getCurrentGameInfo = async (steamId: string) => {
  try {
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

    const gameDetails = await currentGameDetails([steamId]);
    return gameDetails;
  } catch (error) {
    console.error(
      `Ошибка при получении информации об игре для ${steamId}:`,
      error
    );
    throw error;
  }
};

// Основная функция проверки Steam данных для пользователя
export const checkSteamDataForUser = async (
  bot: any,
  user: {
    id: number;
    telegramId: string;
    steam_id: string;
    username: string | null;
  }
) => {
  try {
    console.log(
      `Проверяем Steam данные для пользователя ${user.username || user.telegramId}`
    );

    // Получаем основные данные пользователя
    const userData = await getSteamUserData(user.steam_id);

    // Получаем информацию о текущей игре
    const gameDetails = await getCurrentGameInfo(
      userData.data.player.meta.steamid
    );

    const personaname = userData.data.player.meta.personaname;
    const currentGame = gameDetails.gameextrainfo || null;

    // Получаем последнюю активность из базы
    const lastActivity = await getLastSteamActivity(user.id);

    const groupID = "-1002352664972";
    let shouldSendMessage = false;
    let messageText = "";

    if (!lastActivity) {
      // Первая запись для пользователя
      if (currentGame) {
        shouldSendMessage = true;
        messageText = `${personaname} сейчас в игре: ${currentGame}`;
      }
    } else {
      const now = new Date();
      const hoursSinceLastCheck =
        (now.getTime() - lastActivity.lastChecked.getTime()) / (1000 * 60 * 60);

      if (currentGame && !lastActivity.currentGame) {
        // Пользователь зашел в игру (в базе был null/undefined)
        shouldSendMessage = true;
        messageText = `${personaname} зашел в игру: ${currentGame}`;
      } else if (!currentGame && lastActivity.currentGame) {
        // Пользователь вышел из игры
        shouldSendMessage = true;
        messageText = `${personaname} вышел из игры ${lastActivity.currentGame}`;
      } else if (
        currentGame &&
        lastActivity.currentGame &&
        currentGame !== lastActivity.currentGame
      ) {
        // Пользователь сменил игру
        shouldSendMessage = true;
        messageText = `${personaname} сменил игру с "${lastActivity.currentGame}" на "${currentGame}"`;
      } else if (
        currentGame &&
        lastActivity.currentGame &&
        currentGame === lastActivity.currentGame &&
        hoursSinceLastCheck >= 1
      ) {
        // Прошло больше часа в той же игре
        shouldSendMessage = true;
        messageText = `${personaname} всё ещё играет в ${currentGame} (прошло ${hoursSinceLastCheck.toFixed(1)} часов)`;
      }
    }

    // Отправляем сообщение если нужно
    if (shouldSendMessage && messageText) {
      await bot.api.sendMessage(groupID, messageText);
      console.log(`Отправлено сообщение: ${messageText}`);
    }

    // Обновляем данные в базе
    await updateSteamActivity(user.id, personaname, currentGame);

    return {
      userData,
      gameDetails,
      success: true,
    };
  } catch (error) {
    console.error(
      `Ошибка при проверке данных для пользователя ${user.username || user.telegramId}:`,
      error
    );
    return {
      success: false,
      error,
    };
  }
};

// Функция для проверки всех пользователей с Steam ID
export const checkAllUsersWithSteamId = async (bot: any) => {
  try {
    console.log("Начинаем проверку всех пользователей с Steam ID...");

    const users = await getUsersWithSteamId();
    console.log(`Найдено ${users.length} пользователей с Steam ID`);

    if (users.length === 0) {
      console.log("Нет пользователей с Steam ID для проверки");
      return;
    }

    // Проверяем каждого пользователя с небольшой задержкой
    for (const user of users) {
      if (user.steam_id) {
        await checkSteamDataForUser(bot, {
          ...user,
          steam_id: user.steam_id,
        });
        // Добавляем задержку между запросами, чтобы не превысить лимиты API
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log("Проверка всех пользователей завершена");
  } catch (error) {
    console.error("Ошибка при проверке пользователей:", error);
  }
};

import { InlineKeyboard } from "grammy";

export const profileMenu = async (steamId: string | null) => {
  if (!steamId) {
    return new InlineKeyboard().text("SteamID не указан.", "profile").row();
  }

  return new InlineKeyboard().text(`Профиль Steam`, `steam-${steamId}`).row();
};

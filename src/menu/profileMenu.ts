import { InlineKeyboard } from "grammy";

export const profileMenu = (_selected?: string) => {
  return new InlineKeyboard().text("Steam", "steam").row();
};

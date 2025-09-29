import { InlineKeyboard } from "grammy";

export const profileMenu = (selected?: string) => {
  return new InlineKeyboard().text("Steam", "steam").row();
};

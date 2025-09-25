import { InlineKeyboard } from "grammy";

export const cryptoMenu = new InlineKeyboard()
  .text("Bitcoin", "bitcoin")
  .row()
  .text("Ethereum", "ethereum")
  .row()
  .text("Litecoin", "litecoin")
  .row()
  .text("Назад", "back");

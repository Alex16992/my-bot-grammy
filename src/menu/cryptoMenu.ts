import { InlineKeyboard } from "grammy";

export const cryptoMenu = (selected?: string) => {
  return new InlineKeyboard()
    .text(selected === "bitcoin" ? "Bitcoin ✅" : "Bitcoin", "bitcoin")
    .row()
    .text(selected === "ethereum" ? "Ethereum ✅" : "Ethereum", "ethereum")
    .row()
    .text(selected === "litecoin" ? "Litecoin ✅" : "Litecoin", "litecoin");
};
// .row()
// .text("Назад", "back");

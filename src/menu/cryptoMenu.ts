import { InlineKeyboard } from "grammy";

// Создайте простое меню.

export const cryptoMenu = new InlineKeyboard()
  .text("Bitcoin", "bitcoin")
  .row()
  .text("Ethereum", "ethereum")
  .row()
  .text("Litecoin", "litecoin")
  .row()
  .text("Назад", "back");

// .text("Litecoin", async (ctx) => {
//   try {
//     // Запрос к CoinGecko API
//     const res = await fetch(
//       "https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd"
//     );
//     const data = await res.json();

//     const ltcPrice = data.litecoin.usd;

//     // Отправляем ответ пользователю
//     await ctx.reply(`💰 Курс лайткоина:\nLitecoin: $${ltcPrice}`);
//   } catch (err) {
//     console.error(err);
//     await ctx.reply("Ошибка при получении курса криптовалют.");
//   }

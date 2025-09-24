import { Menu } from "@grammyjs/menu";

// Создайте простое меню.
export const cryptoMenu = new Menu("my-menu-identifier")
  .text("Bitcoin", async (ctx) => {
    try {
      // Запрос к CoinGecko API
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );
      const data = await res.json();

      const btcPrice = data.bitcoin.usd;

      // Отправляем ответ пользователю
      await ctx.reply(`💰 Курс биткоина:\nBitcoin: $${btcPrice}`);
    } catch (err) {
      console.error(err);
      await ctx.reply("Ошибка при получении курса криптовалют.");
    }
  })
  .row()
  .text("Ethereum", async (ctx) => {
    try {
      // Запрос к CoinGecko API
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await res.json();

      const ethPrice = data.ethereum.usd;

      // Отправляем ответ пользователю
      await ctx.reply(`💰 Курс эфириума:\nEthereum: $${ethPrice}`);
    } catch (err) {
      console.error(err);
      await ctx.reply("Ошибка при получении курса криптовалют.");
    }
  })
  .row()
  .text("Litecoin", async (ctx) => {
    try {
      // Запрос к CoinGecko API
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd"
      );
      const data = await res.json();

      const ltcPrice = data.litecoin.usd;

      // Отправляем ответ пользователю
      await ctx.reply(`💰 Курс лайткоина:\nLitecoin: $${ltcPrice}`);
    } catch (err) {
      console.error(err);
      await ctx.reply("Ошибка при получении курса криптовалют.");
    }
  });

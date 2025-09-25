import { cryptoMenu } from "../menu/cryptoMenu.js";
import type { BotContext } from "../types.js";

const cryptoConfig = {
  bitcoin: { id: "bitcoin", name: "Bitcoin", label: "биткоина" },
  ethereum: { id: "ethereum", name: "Ethereum", label: "эфириума" },
  litecoin: { id: "litecoin", name: "Litecoin", label: "лайткоина" },
} as const;

export const cryptoCallback = (bot: any) => {
  Object.keys(cryptoConfig).forEach((crypto) => {
    bot.callbackQuery(crypto, async (ctx: BotContext) => {
      ctx?.callbackQuery?.message &&
        (await ctx.callbackQuery.message.editText(
          await getCryptoPrice(crypto as keyof typeof cryptoConfig),
          {
            reply_markup: await cryptoMenu(
              cryptoConfig[crypto as keyof typeof cryptoConfig].id
            ),
          }
        ));
      await ctx.answerCallbackQuery();
    });
  });
};

const getCryptoPrice = async (cryptoKey: keyof typeof cryptoConfig) => {
  try {
    const config = cryptoConfig[cryptoKey];
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${config.id}&vs_currencies=usd`
    );
    const data = await res.json();
    const price = data[config.id].usd;

    return `💰 Курс ${config.label}:\n${config.name}: $${price}`;
  } catch (err) {
    console.error(err);
    return "Ошибка при получении курса криптовалют.";
  }
};

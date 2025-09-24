import { session } from "grammy";

export interface PizzaSessionData {
  pizzaCount: number;
}

export const pizzaSession = (bot: any) => {
  function initial(): PizzaSessionData {
    return { pizzaCount: 0 };
  }

  bot.use(session({ initial }));
};

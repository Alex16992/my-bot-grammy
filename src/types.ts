import type { Context, SessionFlavor } from "grammy";
import type { PizzaSessionData } from "./session/pizzaSession.js";
import type { HydrateFlavor } from "@grammyjs/hydrate";

// Интерфейс для пользователя
export interface User {
  id: number;
  telegramId: string;
  username: string | null;
  balance: number;
  createdAt: Date;
}

export type BotContext = HydrateFlavor<
  Context & SessionFlavor<PizzaSessionData>
> &
  Context & {
    user?: User | null;
  };

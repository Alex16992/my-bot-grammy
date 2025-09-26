import type { Context, SessionFlavor } from "grammy";
import type { PizzaSessionData } from "./session/pizzaSession.js";
import type { HydrateFlavor } from "@grammyjs/hydrate";

// Интерфейс для пользователя
export interface User {
  id: number;
  telegramId: string;
  username: string | null;
  balance: number;
  svo_score: number;
  wordle_score: number;
  createdAt: Date;
}

// Интерфейс для wordle
export interface WordleAttempt {
  id: number;
  userId: number;
  wordleId: number;
  word: string;
  createdAt: Date;
  attempt: number;
}

export interface Wordle {
  id: number;
  answer: string;
  createdAt: Date;
  WordleAttempt: WordleAttempt[];
}

export type BotContext = HydrateFlavor<
  Context & SessionFlavor<PizzaSessionData>
> &
  Context & {
    user?: User | null;
  };

import type { Context, SessionFlavor } from "grammy";
import type { PizzaSessionData } from "./session/pizzaSession.js";
import type { HydrateFlavor } from "@grammyjs/hydrate";
import type { ConversationFlavor } from "@grammyjs/conversations";

// Интерфейс для пользователя
export interface User {
  id: number;
  telegramId: string;
  username: string | null;
  balance: number;
  svo_score: number;
  wordle_score: number;
  steam_id: string | null;
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

export interface SessionData {
  word: string;
  pizzaCount: number;
  userName: string;
  userPhoto: string;
  userMeme: string;
  userId: number;
  rpsStarted: boolean;
  rps_bot_answer: string;
}

export type BotContext = ConversationFlavor<
  HydrateFlavor<Context & SessionFlavor<SessionData>> &
    Context & {
      user?: User | null;
    }
>;

import type { Context, SessionFlavor } from "grammy";
import type { PizzaSessionData } from "./session/pizzaSession.js";
import type { HydrateFlavor } from "@grammyjs/hydrate";

export type BotContext = HydrateFlavor<Context> &
  Context &
  SessionFlavor<PizzaSessionData>;

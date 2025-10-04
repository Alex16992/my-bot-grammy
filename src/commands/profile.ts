import type { Bot } from "grammy";
import { sendProfile } from "../helpers/profileHelper.js";
import prisma from "../prisma.js";
import type { BotContext } from "../types.js";

export const profileCommand = (bot: Bot<BotContext>) => {
  bot.command("profile", async (ctx: BotContext) => {
    const userName = ctx.match?.toString().substring(1) || null;

    if (!userName) {
      await sendProfile(ctx, ctx.user ? ctx.user.id : 0);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { username: userName },
    });

    console.log("userName:", userName);

    console.log(user?.id);

    await sendProfile(ctx, user?.id ? user.id : ctx.user ? ctx.user.id : 0);
  });
};

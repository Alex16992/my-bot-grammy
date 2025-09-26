import type { BotContext } from "../types.js";

export const replyMsg = (ctx: BotContext, text: string, msgId?: number) =>
  ctx.reply(
    text,
    msgId ? { reply_parameters: { message_id: msgId } } : undefined
  );

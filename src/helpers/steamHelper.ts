import axios from "axios";
import type { BotContext } from "../types.js";

export const updateSteamData = async (
  ctx: BotContext,
  url: string,
  currentData: string,
  newDataProcessor: (data: any) => string,
  errorMessage: string,
  avatarUrl?: string
) => {
  try {
    const { data } = await axios.get(url, {
      headers: { "Content-Type": "application/json" },
    });

    const updatedData = currentData + newDataProcessor(data);

    if (avatarUrl) {
      await ctx.editMessageMedia({
        type: "photo",
        media: avatarUrl,
        caption: `${updatedData}\nПродожается загрузка...`,
      });
    } else {
      await ctx.editMessageCaption({
        caption: `${updatedData}\nПродожается загрузка...`,
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data, updatedData };
  } catch (error) {
    console.log(error);
    await ctx.reply(errorMessage);
    throw error;
  }
};

import type { Bot } from "grammy";
import type { BotContext } from "../types.js";
import { replyMsg } from "../helpers/reply.js";
import prisma from "../prisma.js";
import { getGlobalProgressWordle } from "../helpers/index.js";

export const wordCommand = (bot: Bot<BotContext>) => {
  bot.command("word", async (ctx: BotContext) => {
    const word = ctx.match?.toString().trim().toLowerCase() || "";
    const msgId = ctx.update?.message?.message_id;
    const currentWordle = await prisma.wordle.findFirst({
      orderBy: { createdAt: "desc" },
      include: { WordleAttempt: true },
    });
    const isLetter = word.length === 1 && /^[а-яё]$/i.test(word);
    const isFullWord = word.length === 5 && /^[а-яё]+$/i.test(word);

    if (!currentWordle) {
      return replyMsg(ctx, "Нет активных слов", msgId);
    }

    if (!ctx.user) {
      return replyMsg(ctx, "Пользователь не найден в системе", msgId);
    }

    const attemptsCount = await prisma.wordleAttempt.count({
      where: { userId: ctx.user.id, wordleId: currentWordle.id },
    });

    if (attemptsCount >= 5) {
      const progress = (await getGlobalProgressWordle(currentWordle)).progress;
      return replyMsg(
        ctx,
        `У вас уже 5 попыток на этот Wordle!\nВаш прогресс: ${progress}`,
        msgId
      );
    }

    if (!isLetter && !isFullWord) {
      return replyMsg(
        ctx,
        `Напишите букву или слово из 5 букв\nОсталось попыток: ${
          5 - attemptsCount
        }`,
        msgId
      );
    }

    const remainingAttempts = 5 - attemptsCount - 1;

    // === Если пользователь вводит слово ===
    if (isFullWord) {
      await prisma.wordleAttempt.create({
        data: {
          userId: ctx.user.id,
          wordleId: currentWordle.id,
          word,
          attempt: attemptsCount + 1,
        },
      });

      if (word === currentWordle.answer.toLowerCase()) {
        await prisma.user.update({
          where: { id: ctx.user.id },
          data: { wordle_score: ctx.user.wordle_score + 3 },
        });
        return replyMsg(
          ctx,
          `Поздравляем! Вы угадали слово: ${currentWordle.answer}\n+3 балла - /score`,
          msgId
        );
      }

      return replyMsg(
        ctx,
        `Вы написали слово "${word}". Оно неверное.\nОсталось попыток: ${remainingAttempts}`,
        msgId
      );
    }

    // === Если пользователь вводит букву ===
    if (isLetter) {
      const answerLower = currentWordle.answer.toLowerCase();

      const allAttempts = await prisma.wordleAttempt.findMany({
        where: { wordleId: currentWordle.id },
        select: { word: true },
      });

      const guessedLetters = new Set(
        allAttempts
          .map((a) => a.word)
          .filter((w) => w.length === 1)
          .map((w) => w.toLowerCase())
      );

      const isCorrectLetter = answerLower.includes(word);
      const isNewCorrectLetter = isCorrectLetter && !guessedLetters.has(word);

      if (isNewCorrectLetter) {
        await prisma.user.update({
          where: { id: ctx.user.id },
          data: { wordle_score: ctx.user.wordle_score + 1 },
        });
      }

      await prisma.wordleAttempt.create({
        data: {
          userId: ctx.user.id,
          wordleId: currentWordle.id,
          word,
          attempt: attemptsCount + 1,
        },
      });

      const progress = (await getGlobalProgressWordle(currentWordle)).progress;

      const isWinner = progress === currentWordle.answer;

      if (isWinner) {
        return replyMsg(
          ctx,
          `Поздравляем! Слово "${currentWordle.answer}" полностью угадано! 🎉`,
          msgId
        );
      }

      if (isNewCorrectLetter) {
        return replyMsg(
          ctx,
          `Поздравляем! Вы угадали букву "${word.toUpperCase()}"\n+1 балл - /score\nВаш прогресс: ${progress}\nОсталось попыток: ${remainingAttempts}`,
          msgId
        );
      }

      if (!isCorrectLetter) {
        return replyMsg(
          ctx,
          `Буквы "${word.toUpperCase()}" нет в слове.\nВаш прогресс: ${progress}\nОсталось попыток: ${remainingAttempts}`,
          msgId
        );
      }

      return replyMsg(
        ctx,
        `Буква "${word.toUpperCase()}" уже была открыта.\nВаш прогресс: ${progress}\nОсталось попыток: ${remainingAttempts}`,
        msgId
      );
    }
  });
};

import type { Bot } from "grammy";
import type { BotContext } from "../types.js";
import prisma from "../prisma.js";
import { getGlobalProgressWordle } from "../helpers/index.js";

export const wordCommand = (bot: Bot<BotContext>) => {
  bot.command("word", async (ctx: BotContext) => {
    let word = ctx.match?.toString().trim().toLowerCase() || "";

    if (!word) {
      await ctx.conversation.enter("write_word");
      return; // Выходим из команды, логика продолжится после завершения conversation
    }

    await processWordLogic(ctx, word);
  });
};

export const processWordLogic = async (ctx: BotContext, word: string) => {
  // Получаем пользователя из базы данных, если он не установлен в контексте
  if (!ctx.user && ctx.from) {
    ctx.user = await prisma.user.findUnique({
      where: { telegramId: ctx.from.id.toString() },
    });
  }

  const currentWordle = await prisma.wordle.findFirst({
    orderBy: { createdAt: "desc" },
    include: { WordleAttempt: true },
  });

  const isLetter = word.length === 1 && /^[а-яё]$/i.test(word);
  const isFullWord = word.length === 5 && /^[а-яё]+$/i.test(word);

  if (!currentWordle) {
    return ctx.reply("Нет активных слов");
  }

  if (!ctx.user) {
    return ctx.reply("Пользователь не найден в системе");
  }

  const attemptsCount = await prisma.wordleAttempt.count({
    where: { userId: ctx.user.id, wordleId: currentWordle.id },
  });

  if (attemptsCount >= 5) {
    const progress = (await getGlobalProgressWordle(currentWordle)).progress;
    return ctx.reply(
      `У вас уже 5 попыток на этот Wordle!\nВаш прогресс: ${progress}`
    );
  }

  if (!isLetter && !isFullWord) {
    return ctx.reply(
      `Напишите букву или слово из 5 букв\nОсталось попыток: ${
        5 - attemptsCount
      }`
    );
  }

  const remainingAttempts = 5 - attemptsCount - 1;

  const wordleAttemptCreate = async () => {
    ctx.user
      ? await prisma.wordleAttempt.create({
          data: {
            userId: ctx.user.id,
            wordleId: currentWordle.id,
            word,
            attempt: attemptsCount + 1,
          },
        })
      : ctx.reply("Пользователь не найден в системе");
  };

  // === Если пользователь вводит слово ===
  if (isFullWord) {
    // Заносим попытку в базу
    wordleAttemptCreate();

    if (word === currentWordle.answer.toLowerCase()) {
      await prisma.user.update({
        where: { id: ctx.user.id },
        data: { wordle_score: ctx.user.wordle_score + 3 },
      });
      return ctx.reply(
        `Поздравляем! Вы угадали слово: ${currentWordle.answer}\n+3 балла - /score`
      );
    }

    return ctx.reply(
      `Вы написали слово "${word}". Оно неверное.\nОсталось попыток: ${remainingAttempts}`
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

    console.log(guessedLetters);

    const isCorrectLetter = answerLower.includes(word);
    const isNewCorrectLetter = isCorrectLetter && !guessedLetters.has(word);
    const isNewLetter = !isCorrectLetter && !guessedLetters.has(word);

    let newGuessedLetters = Array.from(guessedLetters);

    if (isNewLetter || isNewCorrectLetter) {
      newGuessedLetters = [...guessedLetters, word];
    }

    if (isNewCorrectLetter) {
      await prisma.user.update({
        where: { id: ctx.user.id },
        data: { wordle_score: ctx.user.wordle_score + 1 },
      });
    }
    // Заносим попытку в базу
    wordleAttemptCreate();

    // перезагружаем актуальные данные
    const updatedWordle = await prisma.wordle.findUnique({
      where: { id: currentWordle.id },
      include: { WordleAttempt: true },
    });

    if (!updatedWordle) {
      return ctx.reply("Ошибка: Wordle не найден");
    }

    const progress = (await getGlobalProgressWordle(updatedWordle)).progress;

    const isWinner = progress === currentWordle.answer;

    if (isWinner) {
      return ctx.reply(
        `Поздравляем! Слово "${currentWordle.answer}" полностью угадано! 🎉`
      );
    }

    if (isNewCorrectLetter) {
      return ctx.reply(
        `Поздравляем! Вы угадали букву "${word.toUpperCase()}"\n+1 балл - /score\nВаш прогресс: ${progress}\nОсталось попыток: ${remainingAttempts}\nСписок прошлых букв: ${newGuessedLetters}`
      );
    }

    if (!isCorrectLetter) {
      return ctx.reply(
        `Буквы "${word.toUpperCase()}" нет в слове.\nВаш прогресс: ${progress}\nОсталось попыток: ${remainingAttempts}\nСписок прошлых букв: ${newGuessedLetters}`
      );
    }

    return ctx.reply(
      `Буква "${word.toUpperCase()}" уже была открыта.\nВаш прогресс: ${progress}\nОсталось попыток: ${remainingAttempts}\nСписок прошлых букв: ${newGuessedLetters}`
    );
  }
};

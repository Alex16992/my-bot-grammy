import prisma from "../prisma.js";
import type { Wordle } from "../types.js";

export const getGlobalProgressWordle = async (currentWordle: Wordle) => {
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

  const progress = currentWordle.answer
    .split("")
    .map((ch) => (guessedLetters.has(ch.toLowerCase()) ? ch : "⬜"))
    .join("");

  return { progress, allAttempts, guessedLetters };
};

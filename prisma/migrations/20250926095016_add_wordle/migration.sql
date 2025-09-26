-- CreateTable
CREATE TABLE "public"."Wordle" (
    "id" SERIAL NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wordle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WordleAttempt" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "wordleId" INTEGER NOT NULL,
    "word" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempt" INTEGER NOT NULL,

    CONSTRAINT "WordleAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WordleAttempt_userId_wordleId_attempt_key" ON "public"."WordleAttempt"("userId", "wordleId", "attempt");

-- AddForeignKey
ALTER TABLE "public"."WordleAttempt" ADD CONSTRAINT "WordleAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WordleAttempt" ADD CONSTRAINT "WordleAttempt_wordleId_fkey" FOREIGN KEY ("wordleId") REFERENCES "public"."Wordle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

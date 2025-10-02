-- CreateTable
CREATE TABLE "public"."SteamActivity" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "personaname" TEXT NOT NULL,
    "currentGame" TEXT,
    "lastChecked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SteamActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SteamActivity_userId_key" ON "public"."SteamActivity"("userId");

-- AddForeignKey
ALTER TABLE "public"."SteamActivity" ADD CONSTRAINT "SteamActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

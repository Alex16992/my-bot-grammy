/*
  Warnings:

  - A unique constraint covering the columns `[steam_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "steam_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_steam_id_key" ON "public"."User"("steam_id");

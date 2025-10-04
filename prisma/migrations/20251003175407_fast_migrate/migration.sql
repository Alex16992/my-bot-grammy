/*
  Warnings:

  - You are about to drop the column `telegramUsername` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_telegramUsername_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "telegramUsername",
ADD COLUMN     "customUsername" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_customUsername_key" ON "public"."User"("customUsername");

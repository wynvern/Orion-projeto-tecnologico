/*
  Warnings:

  - Added the required column `userId` to the `saves` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "saves" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT;

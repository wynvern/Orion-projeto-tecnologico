/*
  Warnings:

  - The `media` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "media",
ADD COLUMN     "media" TEXT[] DEFAULT ARRAY[]::TEXT[];

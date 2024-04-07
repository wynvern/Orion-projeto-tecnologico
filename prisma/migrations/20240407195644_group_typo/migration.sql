/*
  Warnings:

  - You are about to drop the column `avatar` on the `group_profile_pics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "group_profile_pics" DROP COLUMN "avatar",
ADD COLUMN     "logo" TEXT;

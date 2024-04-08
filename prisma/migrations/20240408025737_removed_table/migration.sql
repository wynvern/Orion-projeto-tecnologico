/*
  Warnings:

  - You are about to drop the `recent_group_viewed` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "recent_group_viewed" DROP CONSTRAINT "recent_group_viewed_groupId_fkey";

-- DropForeignKey
ALTER TABLE "recent_group_viewed" DROP CONSTRAINT "recent_group_viewed_userId_fkey";

-- DropTable
DROP TABLE "recent_group_viewed";

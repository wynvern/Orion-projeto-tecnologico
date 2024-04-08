/*
  Warnings:

  - A unique constraint covering the columns `[groupId,userId]` on the table `in_groups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "in_groups_groupId_userId_key" ON "in_groups"("groupId", "userId");

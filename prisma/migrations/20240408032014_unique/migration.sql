/*
  Warnings:

  - A unique constraint covering the columns `[groupId,viewerId]` on the table `group_views` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "group_views_groupId_viewerId_key" ON "group_views"("groupId", "viewerId");

/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `bookmarks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_postId_userId_key" ON "bookmarks"("postId", "userId");

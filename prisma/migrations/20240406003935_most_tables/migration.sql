/*
  Warnings:

  - You are about to drop the `saves` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `in_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `in_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "postId" TEXT NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "in_groups" ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "groupId" TEXT NOT NULL;

-- DropTable
DROP TABLE "saves";

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "in_groups" ADD CONSTRAINT "in_groups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "in_groups" ADD CONSTRAINT "in_groups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

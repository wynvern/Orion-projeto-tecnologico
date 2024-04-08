/*
  Warnings:

  - You are about to drop the `GroupView` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupView" DROP CONSTRAINT "GroupView_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupView" DROP CONSTRAINT "GroupView_viewerId_fkey";

-- DropTable
DROP TABLE "GroupView";

-- CreateTable
CREATE TABLE "recent_group_viewed" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recent_group_viewed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_views" (
    "id" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupId" TEXT NOT NULL,
    "viewerId" TEXT,

    CONSTRAINT "group_views_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recent_group_viewed" ADD CONSTRAINT "recent_group_viewed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recent_group_viewed" ADD CONSTRAINT "recent_group_viewed_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_views" ADD CONSTRAINT "group_views_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_views" ADD CONSTRAINT "group_views_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

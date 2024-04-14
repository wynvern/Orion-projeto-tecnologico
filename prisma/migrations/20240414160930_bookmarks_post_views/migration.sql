-- AlterTable
ALTER TABLE "bookmarks" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "post_views" (
    "id" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,

    CONSTRAINT "post_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_views_postId_viewerId_key" ON "post_views"("postId", "viewerId");

-- AddForeignKey
ALTER TABLE "post_views" ADD CONSTRAINT "post_views_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_views" ADD CONSTRAINT "post_views_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

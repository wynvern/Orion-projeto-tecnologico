-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_postId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "post_media" DROP CONSTRAINT "post_media_postId_fkey";

-- AddForeignKey
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

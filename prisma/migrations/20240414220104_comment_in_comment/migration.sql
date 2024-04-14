-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "parentId" TEXT,
ALTER COLUMN "postId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "comment_media" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "comment_media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_media" ADD CONSTRAINT "comment_media_post" FOREIGN KEY ("commentId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_media" ADD CONSTRAINT "comment_media_comment" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

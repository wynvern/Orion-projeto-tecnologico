-- DropForeignKey
ALTER TABLE "comment_media" DROP CONSTRAINT "comment_media_post";

-- RenameForeignKey
ALTER TABLE "comment_media" RENAME CONSTRAINT "comment_media_comment" TO "comment_media_commentId_fkey";

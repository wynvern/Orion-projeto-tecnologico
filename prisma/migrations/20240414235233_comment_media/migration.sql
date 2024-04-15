-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "medias" TEXT[] DEFAULT ARRAY[]::TEXT[];

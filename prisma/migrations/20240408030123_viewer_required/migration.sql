/*
  Warnings:

  - Made the column `viewerId` on table `group_views` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "group_views" DROP CONSTRAINT "group_views_viewerId_fkey";

-- AlterTable
ALTER TABLE "group_views" ALTER COLUMN "viewerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "group_views" ADD CONSTRAINT "group_views_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

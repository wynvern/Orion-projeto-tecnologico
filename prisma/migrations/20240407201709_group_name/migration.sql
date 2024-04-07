/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `groups` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "groupName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "groups_name_key" ON "groups"("name");

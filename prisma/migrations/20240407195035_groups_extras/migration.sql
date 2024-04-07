-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "GroupView" (
    "id" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupId" TEXT NOT NULL,
    "viewerId" TEXT,

    CONSTRAINT "GroupView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_profile_pics" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "avatar" TEXT,
    "banner" TEXT,

    CONSTRAINT "group_profile_pics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_profile_pics_groupId_key" ON "group_profile_pics"("groupId");

-- AddForeignKey
ALTER TABLE "GroupView" ADD CONSTRAINT "GroupView_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupView" ADD CONSTRAINT "GroupView_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_profile_pics" ADD CONSTRAINT "group_profile_pics_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

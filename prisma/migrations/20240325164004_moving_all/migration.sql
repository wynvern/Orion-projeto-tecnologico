-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "media" TEXT,
    "text" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saves" (
    "id" TEXT NOT NULL,

    CONSTRAINT "saves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "in_groups" (
    "id" TEXT NOT NULL,

    CONSTRAINT "in_groups_pkey" PRIMARY KEY ("id")
);

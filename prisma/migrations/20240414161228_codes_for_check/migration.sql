/*
  Warnings:

  - You are about to drop the `active_codes_for_email` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "active_codes_for_email";

-- CreateTable
CREATE TABLE "code_reset_password" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_reset_password_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code_verify_account" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_verify_account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "code_reset_password_code_key" ON "code_reset_password"("code");

-- CreateIndex
CREATE UNIQUE INDEX "code_verify_account_code_key" ON "code_verify_account"("code");

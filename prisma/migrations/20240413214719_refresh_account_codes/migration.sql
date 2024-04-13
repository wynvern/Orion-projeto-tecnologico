-- CreateTable
CREATE TABLE "active_codes_for_email" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "active_codes_for_email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "active_codes_for_email_code_key" ON "active_codes_for_email"("code");

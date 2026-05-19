-- CreateTable
CREATE TABLE "GymPayoutAccount" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "bankName" TEXT,
    "accountTitle" TEXT,
    "accountNumber" TEXT,
    "iban" TEXT,
    "walletProvider" TEXT,
    "mobileNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GymPayoutAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GymPayoutAccount_gymId_key" ON "GymPayoutAccount"("gymId");

-- AddForeignKey
ALTER TABLE "GymPayoutAccount" ADD CONSTRAINT "GymPayoutAccount_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

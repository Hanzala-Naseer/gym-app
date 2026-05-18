-- AlterTable
ALTER TABLE "CheckIn" ADD COLUMN     "gymPayoutAmount" INTEGER,
ADD COLUMN     "memberTierSlug" TEXT,
ADD COLUMN     "platformAmount" INTEGER;

-- CreateTable
CREATE TABLE "PayoutRate" (
    "id" TEXT NOT NULL,
    "memberTierSlug" TEXT NOT NULL,
    "gymTier" "GymTier" NOT NULL,
    "gymGets" INTEGER NOT NULL,
    "platformKeeps" INTEGER NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayoutRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PayoutRate_memberTierSlug_idx" ON "PayoutRate"("memberTierSlug");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutRate_memberTierSlug_gymTier_key" ON "PayoutRate"("memberTierSlug", "gymTier");

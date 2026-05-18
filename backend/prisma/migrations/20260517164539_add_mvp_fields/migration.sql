/*
  Warnings:

  - Added the required column `gymTierAccess` to the `SubscriptionTier` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GymTier" AS ENUM ('BASIC', 'ULTIMATE', 'ELITE');

-- AlterTable
ALTER TABLE "CheckIn" ADD COLUMN     "isPaidToGym" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payoutAmount" INTEGER;

-- AlterTable
ALTER TABLE "Gym" ADD COLUMN     "gymTier" "GymTier" NOT NULL DEFAULT 'BASIC',
ADD COLUMN     "payoutPerVisit" INTEGER NOT NULL DEFAULT 70;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "remainingVisits" INTEGER;

-- AlterTable
ALTER TABLE "SubscriptionTier" ADD COLUMN     "gymTierAccess" "GymTier" NOT NULL,
ADD COLUMN     "isUnlimited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "monthlyVisitLimit" INTEGER,
ADD COLUMN     "perks" JSONB;

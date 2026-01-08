/*
  Warnings:

  - You are about to drop the column `durationDays` on the `SubscriptionTier` table. All the data in the column will be lost.
  - You are about to drop the column `priceCents` on the `SubscriptionTier` table. All the data in the column will be lost.
  - You are about to drop the column `stripePriceId` on the `SubscriptionTier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Made the column `stripeSubscriptionId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Subscription_stripeSubscriptionId_idx";

-- DropIndex
DROP INDEX "SubscriptionTier_stripePriceId_key";

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "stripeSubscriptionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionTier" DROP COLUMN "durationDays",
DROP COLUMN "priceCents",
DROP COLUMN "stripePriceId";

-- CreateTable
CREATE TABLE "SubscriptionPrice" (
    "id" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPrice_stripePriceId_key" ON "SubscriptionPrice"("stripePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- AddForeignKey
ALTER TABLE "SubscriptionPrice" ADD CONSTRAINT "SubscriptionPrice_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "SubscriptionTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[stripePriceId]` on the table `SubscriptionTier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripePriceId` to the `SubscriptionTier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubscriptionTier" ADD COLUMN     "stripePriceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionTier_stripePriceId_key" ON "SubscriptionTier"("stripePriceId");

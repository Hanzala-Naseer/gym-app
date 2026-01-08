-- DropIndex
DROP INDEX "Subscription_stripePriceId_key";

-- CreateIndex
CREATE INDEX "Subscription_stripeSubscriptionId_idx" ON "Subscription"("stripeSubscriptionId");

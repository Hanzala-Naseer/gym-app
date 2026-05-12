const { PrismaClient } = require("./src/generated/prisma/index.js");

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Create subscription tiers
  const basicTier = await prisma.subscriptionTier.create({
    data: { name: "Basic", accessTier: 1 },
  });

  const premiumTier = await prisma.subscriptionTier.create({
    data: { name: "Premium", accessTier: 2 },
  });

  const ultimateTier = await prisma.subscriptionTier.create({
    data: { name: "Ultimate", accessTier: 3 },
  });

  // 2️⃣ Create Stripe prices
  await prisma.subscriptionPrice.createMany({
    data: [
      {
        tierId: basicTier.id,
        stripePriceId: "price_1SbLZhCHiTsNekZw5s9Ixsur",
        interval: "monthly",
        priceCents: 999,
      },
      {
        tierId: premiumTier.id,
        stripePriceId: "price_1SbLWnCHiTsNekZweo07ighy",
        interval: "monthly",
        priceCents: 1999,
      },
      {
        tierId: ultimateTier.id,
        stripePriceId: "price_1SbLTzCHiTsNekZwutnCjL46",
        interval: "monthly",
        priceCents: 2999,
      },
    ],
  });

  console.log("✅ Subscription tiers & prices seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

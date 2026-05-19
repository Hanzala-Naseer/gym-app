require("dotenv").config();

const { PrismaClient } = require("./src/generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

///////////////////////////////////////////////////////////////
// DYNAMIC PAYOUT CALCULATOR (mirrors payoutController logic)
///////////////////////////////////////////////////////////////

/**
 * Calculate gymGets + platformKeeps for any member tier × gym tier combo.
 * This is the SAME math your payoutController uses at check-in time.
 */
const calculatePayoutRate = (memberTierSlug, gymTier) => {
  // Base platform charge per visit (what member effectively pays per visit)
  // This comes from subscription price ÷ visit limit
  const baseCharges = {
    basic: 306, // 4900 PKR / 16 visits
    ultimate: 296, // 8900 PKR / 30 visits
    elite: 286, // 12900 PKR / unlimited (effective per-visit cost)
  };

  // Gym tier premium multipliers
  const tierMultipliers = {
    BASIC: 1.0,
    ULTIMATE: 1.15,
    ELITE: 1.3,
  };

  // Platform margin % by gym tier (higher gym tier = lower platform cut)
  const platformMargins = {
    BASIC: 0.3, // 30% platform, 70% gym
    ULTIMATE: 0.2, // 20% platform, 80% gym
    ELITE: 0.1, // 10% platform, 90% gym
  };

  const baseCharge = baseCharges[memberTierSlug] || 286;
  const multiplier = tierMultipliers[gymTier] || 1.0;
  const platformMargin = platformMargins[gymTier] || 0.3;

  // Total platform charge for this visit
  const totalCharge = Math.round(baseCharge * multiplier);

  // Split between gym and platform
  const platformKeeps = Math.round(totalCharge * platformMargin);
  const gymGets = totalCharge - platformKeeps;

  return {
    gymGets,
    platformKeeps,
    multiplier,
    totalCharge,
  };
};

///////////////////////////////////////////////////////////////
// MAIN
///////////////////////////////////////////////////////////////

async function main() {
  console.log("\n🌱 Minimal seed with DYNAMIC payout rates...\n");

  // ── CLEAN ──────────────────────────────────────────────────
  console.log("🧹 Cleaning...");
  await prisma.adminAuditLog.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.gymPhoto.deleteMany();
  await prisma.gymVerificationDocument.deleteMany();
  await prisma.gym.deleteMany();
  await prisma.subscriptionPrice.deleteMany();
  await prisma.subscriptionTier.deleteMany();
  await prisma.payoutRate.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Clean\n");

  const hashedPassword = await bcrypt.hash("123456", 10);

  // ── 1 ADMIN ────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@gymkey.pk",
      passwordHash: hashedPassword,
      role: "admin",
    },
  });
  console.log("👨‍💼 Admin: admin@gymkey.pk");

  // ── DYNAMIC PAYOUT RATES (calculated, not hardcoded) ──────
  // These match what payoutController computes at check-in time
  const rateConfigs = [
    { memberTierSlug: "basic", gymTier: "BASIC" },
    { memberTierSlug: "ultimate", gymTier: "BASIC" },
    { memberTierSlug: "ultimate", gymTier: "ULTIMATE" },
    { memberTierSlug: "elite", gymTier: "BASIC" },
    { memberTierSlug: "elite", gymTier: "ULTIMATE" },
    { memberTierSlug: "elite", gymTier: "ELITE" },
  ];

  const seededRates = [];
  for (const cfg of rateConfigs) {
    const calc = calculatePayoutRate(cfg.memberTierSlug, cfg.gymTier);

    const rate = await prisma.payoutRate.create({
      data: {
        memberTierSlug: cfg.memberTierSlug,
        gymTier: cfg.gymTier,
        gymGets: calc.gymGets,
        platformKeeps: calc.platformKeeps,
        multiplier: calc.multiplier,
        isActive: true,
      },
    });

    seededRates.push(rate);
    console.log(
      `💰 ${cfg.memberTierSlug} × ${cfg.gymTier} → gym: ${calc.gymGets} | platform: ${calc.platformKeeps} | total: ${calc.totalCharge}`,
    );
  }

  // ── 3 SUBSCRIPTION TIERS ───────────────────────────────────
  const basicTier = await prisma.subscriptionTier.create({
    data: {
      name: "Basic",
      slug: "basic",
      accessTier: 1,
      gymTierAccess: "BASIC",
      monthlyVisitLimit: 16,
      isUnlimited: false,
      isActive: true,
    },
  });
  const ultimateTier = await prisma.subscriptionTier.create({
    data: {
      name: "Ultimate",
      slug: "ultimate",
      accessTier: 2,
      gymTierAccess: "ULTIMATE",
      monthlyVisitLimit: 30,
      isUnlimited: false,
      isActive: true,
    },
  });
  const eliteTier = await prisma.subscriptionTier.create({
    data: {
      name: "Elite",
      slug: "elite",
      accessTier: 3,
      gymTierAccess: "ELITE",
      monthlyVisitLimit: null,
      isUnlimited: true,
      isActive: true,
    },
  });
  console.log("\n📦 3 Tiers seeded");

  // ── 5 GYMS ─────────────────────────────────────────────────
  const gymData = [
    {
      name: "Basic Gym Lahore",
      city: "Lahore",
      tier: "BASIC",
      ownerEmail: "owner1@gymkey.pk",
    },
    {
      name: "Ultimate Gym Karachi",
      city: "Karachi",
      tier: "ULTIMATE",
      ownerEmail: "owner2@gymkey.pk",
    },
    {
      name: "Elite Gym Islamabad",
      city: "Islamabad",
      tier: "ELITE",
      ownerEmail: "owner3@gymkey.pk",
    },
    {
      name: "Basic Gym 2 Multan",
      city: "Multan",
      tier: "BASIC",
      ownerEmail: "owner4@gymkey.pk",
    },
    {
      name: "Ultimate Gym 2 Lahore",
      city: "Lahore",
      tier: "ULTIMATE",
      ownerEmail: "owner5@gymkey.pk",
    },
  ];

  const gyms = [];
  for (let i = 0; i < gymData.length; i++) {
    const gd = gymData[i];
    const owner = await prisma.user.create({
      data: {
        name: `Owner ${i + 1}`,
        email: gd.ownerEmail,
        passwordHash: hashedPassword,
        role: "owner",
      },
    });

    const gym = await prisma.gym.create({
      data: {
        name: gd.name,
        city: gd.city,
        gymTier: gd.tier,
        status: i < 4 ? "approved" : "pending",
        ownerId: owner.id,
        latitude: 31.5 + Math.random(),
        longitude: 74.3 + Math.random(),
        addressLine: "Test Address",
      },
    });
    gyms.push(gym);
    console.log(`🏋️  ${gym.name} [${gd.tier}] — ${gym.status}`);
  }

  // ── 3 MEMBERS with check-ins ───────────────────────────────
  const members = [
    {
      email: "member1@gmail.com",
      tier: basicTier,
      tierSlug: "basic",
      gymTier: "BASIC",
      visits: 5,
    },
    {
      email: "member2@gmail.com",
      tier: ultimateTier,
      tierSlug: "ultimate",
      gymTier: "ULTIMATE",
      visits: 8,
    },
    {
      email: "member3@gmail.com",
      tier: eliteTier,
      tierSlug: "elite",
      gymTier: "ELITE",
      visits: 12,
    },
  ];

  let totalCheckins = 0;

  for (const m of members) {
    const user = await prisma.user.create({
      data: {
        name: m.email.split("@")[0],
        email: m.email,
        passwordHash: hashedPassword,
        role: "user",
      },
    });

    const sub = await prisma.subscription.create({
      data: {
        userId: user.id,
        tierId: m.tier.id,
        stripeSubscriptionId: `sub_${m.email}`,
        stripePriceId: `price_${m.tierSlug}`,
        status: "active",
      },
    });

    await prisma.payment.create({
      data: {
        userId: user.id,
        subscriptionId: sub.id,
        amountCents: 490000,
        currency: "pkr",
        status: "succeeded",
      },
    });

    // Find matching rate from seeded rates (same lookup as payoutController)
    const targetGym = gyms.find((g) => g.gymTier === m.gymTier);
    const rate = seededRates.find(
      (r) => r.memberTierSlug === m.tierSlug && r.gymTier === m.gymTier,
    );

    if (!rate) {
      console.warn(`⚠️ No rate found for ${m.tierSlug} × ${m.gymTier}`);
      continue;
    }

    for (let v = 0; v < m.visits; v++) {
      const isPaid = v < Math.floor(m.visits * 0.6); // 60% paid, 40% unpaid

      await prisma.checkIn.create({
        data: {
          userId: user.id,
          gymId: targetGym.id,
          memberTierSlug: m.tierSlug,
          gymPayoutAmount: rate.gymGets, // ← from calculated rate
          platformAmount: rate.platformKeeps, // ← from calculated rate
          isPaidToGym: isPaid,
          checkedInAt: new Date(Date.now() - v * 24 * 60 * 60 * 1000),
        },
      });
      totalCheckins++;
    }
    console.log(
      `👤 ${m.email} — ${m.visits} check-ins (${m.tierSlug} at ${m.gymTier})`,
    );
  }

  // ── 1 PAYOUT AUDIT LOG ─────────────────────────────────────
  await prisma.adminAuditLog.create({
    data: {
      adminId: admin.id,
      action: "PROCESSED_PAYOUT",
      entityType: "Gym",
      entityId: gyms[0].id,
      metadata: {
        gymName: gyms[0].name,
        totalGymPKR: 450,
        checkInsPaid: 3,
        payoutMethod: "bank_transfer",
      },
    },
  });
  console.log("📝 1 Audit log seeded");

  // ── DONE ───────────────────────────────────────────────────
  console.log("\n=================================================");
  console.log("✅ MINIMAL SEED COMPLETE (DYNAMIC RATES)");
  console.log("=================================================");
  console.log("Payout rates were CALCULATED, not hardcoded");
  console.log("Same math as payoutController.js");
  console.log("=================================================");
  console.log("\n🔐 TEST LOGIN: admin@gymkey.pk / 123456");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

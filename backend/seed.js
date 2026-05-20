require("dotenv").config();

const { PrismaClient } = require("./src/generated/prisma");
const bcrypt = require("bcryptjs");
const Stripe = require("stripe");

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

///////////////////////////////////////////////////////////////
// HELPERS
///////////////////////////////////////////////////////////////

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomBool = () => Math.random() > 0.5;

///////////////////////////////////////////////////////////////
// STATIC DATA
///////////////////////////////////////////////////////////////

const gymNames = [
  "Iron Forge Gym",
  "Titan Fitness",
  "Alpha Strength Club",
  "Pulse Fitness Arena",
  "Core Power Gym",
  "Flex Nation",
  "Muscle Lab",
  "Beast Factory",
  "Prime Fitness",
  "Elite Iron Club",
  "Power Zone",
  "Fit Empire",
  "Body Garage",
  "Olympia Fitness",
  "Warrior Gym",
  "Transform Fitness",
  "FitHub Arena",
  "Peak Performance",
  "Iron Temple",
  "Royal Fitness Club",
];

const cities = [
  { city: "Lahore", province: "Punjab", lat: 31.5204, lng: 74.3587 },
  { city: "Karachi", province: "Sindh", lat: 24.8607, lng: 67.0011 },
  { city: "Islamabad", province: "Islamabad", lat: 33.6844, lng: 73.0479 },
  { city: "Multan", province: "Punjab", lat: 30.1575, lng: 71.5249 },
  { city: "Faisalabad", province: "Punjab", lat: 31.4504, lng: 73.135 },
];

const gymImages = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop",
];

///////////////////////////////////////////////////////////////
// COMPLETE 9-ROW PAYOUT MATRIX
//
// Design logic:
//   - Basic member can only access BASIC gyms → 1 valid row
//   - Ultimate member can access BASIC + ULTIMATE gyms → 2 rows
//   - Elite member can access ALL gym tiers → 3 rows
//
// Multipliers reflect gym tier premium:
//   BASIC = 1.00x  |  ULTIMATE = 1.15x  |  ELITE = 1.30x
//
// gymGets + platformKeeps = total platform charge per visit.
// Elite gyms keep more of the payout; platform margin shrinks
// at higher gym tiers (gym quality attracts more visits).
//
// Member Tier │ Gym Tier │ Multiplier │ Gym Gets │ Platform Keeps │ Total
// ────────────┼──────────┼────────────┼──────────┼────────────────┼──────
// basic       │ BASIC    │ 1.00x      │   214    │       92       │  306
// ultimate    │ BASIC    │ 1.00x      │   207    │       89       │  296
// ultimate    │ ULTIMATE │ 1.15x      │   238    │       58       │  296
// elite       │ BASIC    │ 1.00x      │   200    │       86       │  286
// elite       │ ULTIMATE │ 1.15x      │   230    │       56       │  286
// elite       │ ELITE    │ 1.30x      │   260    │       26       │  286
//
// NOTE: basic×ULTIMATE and basic×ELITE rows are intentionally
// omitted from the DB because Basic members cannot access those
// gym tiers. fetchPayoutRate() is only called after access-level
// validation, so these combos should never be attempted.
// However, we include them here as INACTIVE rows to prevent the
// "No active payout rate" error if a race condition occurs.
//
// ─── INACTIVE GUARD ROWS ─────────────────────────────────────
// basic       │ ULTIMATE │ —          │   214    │       92       │  306
// basic       │ ELITE    │ —          │   214    │       92       │  306
// ultimate    │ ELITE    │ —          │   238    │       58       │  296
///////////////////////////////////////////////////////////////

const PAYOUT_MATRIX = [
  // ── Active rows (valid member × gym tier combinations) ──────
  {
    memberTierSlug: "basic",
    gymTier: "BASIC",
    gymGets: 214,
    platformKeeps: 92,
    multiplier: 1.0,
    isActive: true,
  },
  {
    memberTierSlug: "ultimate",
    gymTier: "BASIC",
    gymGets: 207,
    platformKeeps: 89,
    multiplier: 1.0,
    isActive: true,
  },
  {
    memberTierSlug: "ultimate",
    gymTier: "ULTIMATE",
    gymGets: 238,
    platformKeeps: 58,
    multiplier: 1.15,
    isActive: true,
  },
  {
    memberTierSlug: "elite",
    gymTier: "BASIC",
    gymGets: 200,
    platformKeeps: 86,
    multiplier: 1.0,
    isActive: true,
  },
  {
    memberTierSlug: "elite",
    gymTier: "ULTIMATE",
    gymGets: 230,
    platformKeeps: 56,
    multiplier: 1.15,
    isActive: true,
  },
  {
    memberTierSlug: "elite",
    gymTier: "ELITE",
    gymGets: 260,
    platformKeeps: 26,
    multiplier: 1.3,
    isActive: true,
  },

  // ── Inactive guard rows (invalid access combos — should never fire) ──
  // These prevent a hard throw if access-level validation is ever bypassed.
  {
    memberTierSlug: "basic",
    gymTier: "ULTIMATE",
    gymGets: 214,
    platformKeeps: 92,
    multiplier: 1.0,
    isActive: false, // INACTIVE — Basic members cannot enter ULTIMATE gyms
  },
  {
    memberTierSlug: "basic",
    gymTier: "ELITE",
    gymGets: 214,
    platformKeeps: 92,
    multiplier: 1.0,
    isActive: false, // INACTIVE — Basic members cannot enter ELITE gyms
  },
  {
    memberTierSlug: "ultimate",
    gymTier: "ELITE",
    gymGets: 238,
    platformKeeps: 58,
    multiplier: 1.15,
    isActive: false, // INACTIVE — Ultimate members cannot enter ELITE gyms
  },
];

/**
 * Resolve the ACTIVE payout rate for a member tier + gym tier pair.
 * Returns null if the combination is invalid (member can't access that gym tier).
 */
const resolveRate = (memberTierSlug, gymTier) =>
  PAYOUT_MATRIX.find(
    (r) =>
      r.memberTierSlug === memberTierSlug &&
      r.gymTier === gymTier &&
      r.isActive === true,
  ) ?? null;

///////////////////////////////////////////////////////////////
// GYM ACCESS RULES
// Mirrors the access-level logic in checkInController.
///////////////////////////////////////////////////////////////

const canAccess = (memberSlug, gymTier) => {
  if (memberSlug === "elite") return true;
  if (memberSlug === "ultimate")
    return gymTier === "BASIC" || gymTier === "ULTIMATE";
  if (memberSlug === "basic") return gymTier === "BASIC";
  return false;
};

///////////////////////////////////////////////////////////////
// STRIPE HELPER
///////////////////////////////////////////////////////////////

async function createStripePlan({ name, amount, slug, description }) {
  console.log(`  ⚡ Stripe → ${name}`);
  const product = await stripe.products.create({ name, description });
  const price = await stripe.prices.create({
    unit_amount: amount,
    currency: "pkr",
    recurring: { interval: "month" },
    product: product.id,
  });
  return { stripeProductId: product.id, stripePriceId: price.id, slug };
}

///////////////////////////////////////////////////////////////
// MAIN
///////////////////////////////////////////////////////////////

async function main() {
  console.log("\n🌱 Starting FULL fresh seed...\n");

  // ── CLEAN ──────────────────────────────────────────────────
  console.log("🧹 Cleaning database...");
  await prisma.adminAuditLog.deleteMany();
  await prisma.adminNotification.deleteMany();
  await prisma.qrJtiUsage.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.gymVerificationDocument.deleteMany();
  await prisma.gymPhoto.deleteMany();
  await prisma.gym.deleteMany();
  await prisma.subscriptionPrice.deleteMany();
  await prisma.subscriptionTier.deleteMany();
  await prisma.payoutRate.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Database clean\n");

  const hashedPassword = await bcrypt.hash("123456", 10);

  // ── ADMIN ───────────────────────────────────────────────────
  console.log("👨‍💼 Creating admin...");
  const admin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@gymkey.pk",
      passwordHash: hashedPassword,
      role: "admin",
    },
  });

  // ── PAYOUT RATE TABLE (9 rows = 6 active + 3 inactive guards) ──
  console.log("💰 Seeding PayoutRate matrix (9 rows)...");
  for (const row of PAYOUT_MATRIX) {
    await prisma.payoutRate.create({ data: row });
    const status = row.isActive ? "✓" : "⊘ GUARD";
    console.log(
      `  ${status} ${row.memberTierSlug} × ${row.gymTier} → gym: ${row.gymGets} PKR | platform: ${row.platformKeeps} PKR`,
    );
  }

  // ── STRIPE PLANS ────────────────────────────────────────────
  console.log("\n⚡ Creating Stripe plans...");
  const basicStripe = await createStripePlan({
    name: "GymKey Basic",
    amount: 490000,
    slug: "basic",
    description: "16 visits/month to Basic gyms",
  });
  const ultimateStripe = await createStripePlan({
    name: "GymKey Ultimate",
    amount: 890000,
    slug: "ultimate",
    description: "30 visits/month to Basic + Ultimate gyms",
  });
  const eliteStripe = await createStripePlan({
    name: "GymKey Elite",
    amount: 1290000,
    slug: "elite",
    description: "Unlimited visits to all gym tiers",
  });

  // ── SUBSCRIPTION TIERS ──────────────────────────────────────
  console.log("\n📦 Creating subscription tiers...");
  const basicTier = await prisma.subscriptionTier.create({
    data: {
      name: "Basic",
      slug: "basic",
      description: "Access to Basic gyms — 16 visits/month",
      accessTier: 1,
      gymTierAccess: "BASIC",
      monthlyVisitLimit: 16,
      isUnlimited: false,
      isFeatured: false,
      perks: { visits: 16, gymAccess: "Basic gyms only" },
    },
  });

  const ultimateTier = await prisma.subscriptionTier.create({
    data: {
      name: "Ultimate",
      slug: "ultimate",
      description: "Access to Basic + Ultimate gyms — 30 visits/month",
      accessTier: 2,
      gymTierAccess: "ULTIMATE",
      monthlyVisitLimit: 30,
      isUnlimited: false,
      isFeatured: true,
      perks: { visits: 30, gymAccess: "Basic + Ultimate gyms" },
    },
  });

  const eliteTier = await prisma.subscriptionTier.create({
    data: {
      name: "Elite",
      slug: "elite",
      description: "Unlimited access to ALL gym tiers",
      accessTier: 3,
      gymTierAccess: "ELITE",
      monthlyVisitLimit: null,
      isUnlimited: true,
      isFeatured: true,
      perks: {
        visits: "Unlimited",
        gymAccess: "Basic + Ultimate + Elite gyms",
      },
    },
  });

  // ── SUBSCRIPTION PRICES ─────────────────────────────────────
  console.log("💳 Creating subscription prices...");
  await prisma.subscriptionPrice.createMany({
    data: [
      {
        tierId: basicTier.id,
        stripeProductId: basicStripe.stripeProductId,
        stripePriceId: basicStripe.stripePriceId,
        interval: "monthly",
        priceCents: 490000,
        currency: "pkr",
      },
      {
        tierId: ultimateTier.id,
        stripeProductId: ultimateStripe.stripeProductId,
        stripePriceId: ultimateStripe.stripePriceId,
        interval: "monthly",
        priceCents: 890000,
        currency: "pkr",
      },
      {
        tierId: eliteTier.id,
        stripeProductId: eliteStripe.stripeProductId,
        stripePriceId: eliteStripe.stripePriceId,
        interval: "monthly",
        priceCents: 1290000,
        currency: "pkr",
      },
    ],
  });

  // ── GYMS ────────────────────────────────────────────────────
  console.log("\n🏋️  Creating 25 gyms...");
  const gyms = [];

  for (let i = 1; i <= 25; i++) {
    const city = randomItem(cities);
    const gymTier = randomItem(["BASIC", "ULTIMATE", "ELITE"]);

    const owner = await prisma.user.create({
      data: {
        name: `Gym Owner ${i}`,
        email: `owner${i}@gymkey.pk`,
        passwordHash: hashedPassword,
        role: "owner",
      },
    });

    const gym = await prisma.gym.create({
      data: {
        name: `${gymNames[i % gymNames.length]} ${i}`,
        description:
          "Premium fitness club with cardio zone, strength area, personal trainers, and modern equipment.",
        addressLine: `${100 + i} Main Boulevard`,
        city: city.city,
        province: city.province,
        postalCode: `540${i}`,
        latitude: city.lat + Math.random() * 0.05,
        longitude: city.lng + Math.random() * 0.05,
        phoneNumber: `03001234${100 + i}`,
        whatsappNumber: `03001234${100 + i}`,
        instagramHandle: `gym${i}`,
        websiteUrl: `https://gym${i}.com`,
        googleMapsLink: "https://maps.google.com",
        cnicNumber: `35202-123456${i}-1`,
        businessName: `${gymNames[i % gymNames.length]} Pvt Ltd`,
        openingTime: "06:00 AM",
        closingTime: "11:00 PM",
        is24Hours: i % 6 === 0,
        tier: gymTier === "BASIC" ? 1 : gymTier === "ULTIMATE" ? 2 : 3,
        gymTier,
        payoutPerVisit: 0, // legacy field; actual payouts driven by PayoutRate table
        coverImageUrl: randomItem(gymImages),
        status: "approved",
        submittedAt: new Date(),
        reviewedAt: new Date(),
        reviewedByAdminId: admin.id,
        approvalNotes: "Approved after verification",
        isFeatured: randomBool(),
        ownerId: owner.id,
      },
    });

    await prisma.gymPhoto.createMany({
      data: Array.from({ length: 5 }, () => ({
        gymId: gym.id,
        url: randomItem(gymImages),
      })),
    });

    await prisma.gymVerificationDocument.createMany({
      data: [
        {
          gymId: gym.id,
          type: "owner_cnic",
          fileUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
          status: "approved",
          reviewedAt: new Date(),
        },
        {
          gymId: gym.id,
          type: "business_license",
          fileUrl:
            "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
          status: "approved",
          reviewedAt: new Date(),
        },
      ],
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.id,
        action: "APPROVED_GYM",
        entityType: "GYM",
        entityId: gym.id,
        metadata: { gymName: gym.name, gymTier },
      },
    });

    gyms.push(gym);
    console.log(`  ✓ ${gym.name} [${gymTier}]`);
  }

  // ── MEMBERS + SUBSCRIPTIONS + CHECK-INS ─────────────────────
  console.log("\n👥 Creating 300 members...");

  const planOptions = [
    {
      tier: basicTier,
      stripePriceId: basicStripe.stripePriceId,
      amount: 490000,
    },
    {
      tier: ultimateTier,
      stripePriceId: ultimateStripe.stripePriceId,
      amount: 890000,
    },
    {
      tier: eliteTier,
      stripePriceId: eliteStripe.stripePriceId,
      amount: 1290000,
    },
  ];

  let totalCheckInsCreated = 0;

  for (let i = 1; i <= 300; i++) {
    const selected = randomItem(planOptions);
    const { tier } = selected;

    const user = await prisma.user.create({
      data: {
        name: `Member ${i}`,
        email: `member${i}@gmail.com`,
        passwordHash: hashedPassword,
        role: "user",
      },
    });

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        tierId: tier.id,
        stripeSubscriptionId: `sub_demo_${Date.now()}_${i}`,
        stripePriceId: selected.stripePriceId,
        status: "active",
        remainingVisits: tier.isUnlimited ? null : tier.monthlyVisitLimit,
        startAt: new Date(),
        endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.payment.create({
      data: {
        userId: user.id,
        subscriptionId: subscription.id,
        amountCents: selected.amount,
        currency: "pkr",
        paymentProvider: "stripe",
        stripePaymentIntent: `pi_${Date.now()}_${i}`,
        status: "succeeded",
        metadata: { source: "seed" },
      },
    });

    // Only allow gyms this member tier can actually access
    const allowedGyms = gyms.filter((g) => canAccess(tier.slug, g.gymTier));

    const totalCheckIns = randomNumber(2, 20);
    const checkInData = [];

    for (let c = 0; c < totalCheckIns; c++) {
      const gym = randomItem(allowedGyms);
      const rate = resolveRate(tier.slug, gym.gymTier);

      // rate should never be null here — canAccess + resolveRate are in sync.
      // Log a warning if it somehow is, so bugs surface during seed.
      if (!rate) {
        console.warn(
          `  ⚠️  No rate for ${tier.slug} × ${gym.gymTier} — skipping check-in`,
        );
        continue;
      }

      checkInData.push({
        userId: user.id,
        gymId: gym.id,
        memberTierSlug: tier.slug,
        gymPayoutAmount: rate.gymGets, // locked from matrix at check-in time
        platformAmount: rate.platformKeeps, // locked from matrix at check-in time
        payoutAmount: rate.gymGets, // legacy field kept for compat
        isPaidToGym: randomBool(),
        qrJti: `qr_seed_${i}_${c}_${Date.now()}`,
        checkedInAt: new Date(
          Date.now() - randomNumber(1, 25) * 24 * 60 * 60 * 1000,
        ),
      });
    }

    if (checkInData.length > 0) {
      await prisma.checkIn.createMany({ data: checkInData });
      totalCheckInsCreated += checkInData.length;
    }

    if (i % 50 === 0) console.log(`  ✓ ${i}/300 members seeded`);
  }

  // ── DONE ────────────────────────────────────────────────────
  console.log("\n=================================================");
  console.log("✅  FULL DATABASE SEEDED SUCCESSFULLY");
  console.log("=================================================");
  console.log("👨‍💼  1 Admin");
  console.log("💰  9 PayoutRate rows (6 active + 3 inactive guards)");
  console.log("📦  3 Subscription tiers (Basic / Ultimate / Elite)");
  console.log("💳  3 Stripe products + prices");
  console.log("🏋️   25 Gyms (mix of BASIC / ULTIMATE / ELITE)");
  console.log("👥  300 Members");
  console.log("📋  300 Subscriptions + Payments");
  console.log(
    `📍  ${totalCheckInsCreated.toLocaleString()} Check-ins (payout locked per matrix)`,
  );
  console.log("=================================================");
  console.log("\n📊 Platform Earnings Formula (run in analytics controller):");
  console.log(
    "   SELECT SUM(platformAmount) WHERE isPaidToGym = true  → paid platform revenue",
  );
  console.log(
    "   SELECT SUM(platformAmount) WHERE isPaidToGym = false → accrued (not yet settled)",
  );
  console.log("\n🔐 TEST LOGINS (password: 123456)");
  console.log("  Admin  → admin@gymkey.pk");
  console.log("  Owner  → owner1@gymkey.pk");
  console.log("  Member → member1@gmail.com\n");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

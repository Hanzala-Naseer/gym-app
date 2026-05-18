
// controllers/payoutController.js
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

///////////////////////////////////////////////////////////////
// HELPERS
///////////////////////////////////////////////////////////////

/**
 * Fetch the active payout rate for a (memberTierSlug × gymTier) pair from DB.
 * Throws if no rate is configured so the bug is obvious immediately.
 */
const fetchPayoutRate = async (memberTierSlug, gymTier) => {
  const rate = await prisma.payoutRate.findFirst({
    where: {
      memberTierSlug: memberTierSlug.toLowerCase(),
      gymTier,
      isActive: true,
    },
  });

  if (!rate) {
    throw new Error(
      `No active payout rate for member tier "${memberTierSlug}" × gym tier "${gymTier}". ` +
        `Run seed-payout-rates.js to populate the PayoutRate table.`,
    );
  }

  return rate;
};

/**
 * Resolve a user's current active subscription tier slug.
 * Returns e.g. "basic" | "ultimate" | "elite" or null.
 */
const resolveUserTierSlug = async (userId) => {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: "active" },
    include: { tier: { select: { slug: true } } },
    orderBy: { createdAt: "desc" },
  });
  return subscription?.tier?.slug ?? null;
};

/**
 * Sum gymPayoutAmount across check-in records.
 * Amounts are locked at check-in time so history is always accurate.
 */
const sumGymPayouts = (checkIns) =>
  checkIns.reduce((sum, ci) => sum + (ci.gymPayoutAmount ?? 0), 0);

///////////////////////////////////////////////////////////////
// GET PAYOUT SUMMARY FOR A GYM  (Owner / Admin)
///////////////////////////////////////////////////////////////

const getGymPayoutSummary = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { id: userId, role: userRole } = req.user;

    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      include: { owner: true },
    });

    if (!gym)
      return res.status(404).json({ success: false, message: "Gym not found" });
    if (userRole !== "admin" && gym.ownerId !== userId)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const [unpaidCheckIns, paidCheckIns] = await Promise.all([
      prisma.checkIn.findMany({
        where: { gymId, isPaidToGym: false },
        select: { id: true, gymPayoutAmount: true },
      }),
      prisma.checkIn.findMany({
        where: { gymId, isPaidToGym: true },
        select: { id: true, gymPayoutAmount: true },
      }),
    ]);

    return res.json({
      success: true,
      summary: {
        gymId,
        gymName: gym.name,
        gymTier: gym.gymTier,
        unpaid: {
          visits: unpaidCheckIns.length,
          amountPKR: sumGymPayouts(unpaidCheckIns),
        },
        paid: {
          visits: paidCheckIns.length,
          amountPKR: sumGymPayouts(paidCheckIns),
        },
        totalVisits: unpaidCheckIns.length + paidCheckIns.length,
      },
    });
  } catch (err) {
    console.error("getGymPayoutSummary error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// LIST UNPAID CHECK-INS FOR A GYM
///////////////////////////////////////////////////////////////

const getUnpaidCheckIns = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { id: userId, role: userRole } = req.user;

    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      select: { id: true, name: true, ownerId: true, gymTier: true },
    });

    if (!gym)
      return res.status(404).json({ success: false, message: "Gym not found" });
    if (userRole !== "admin" && gym.ownerId !== userId)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const checkIns = await prisma.checkIn.findMany({
      where: { gymId, isPaidToGym: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            subscriptions: {
              where: { status: "active" },
              take: 1,
              orderBy: { createdAt: "desc" },
              include: { tier: { select: { slug: true, name: true } } },
            },
          },
        },
      },
      orderBy: { checkedInAt: "asc" },
    });

    const enriched = checkIns.map((ci) => ({
      id: ci.id,
      checkedInAt: ci.checkedInAt,
      gymPayoutAmount: ci.gymPayoutAmount,
      platformAmount: ci.platformAmount,
      memberTierSlug:
        ci.memberTierSlug ?? ci.user.subscriptions[0]?.tier?.slug ?? "unknown",
      memberTierName: ci.user.subscriptions[0]?.tier?.name ?? "Unknown",
      user: {
        id: ci.user.id,
        name: ci.user.name,
        email: ci.user.email,
      },
    }));

    return res.json({
      success: true,
      gymName: gym.name,
      gymTier: gym.gymTier,
      count: enriched.length,
      totalUnpaidPKR: sumGymPayouts(
        checkIns.map((ci) => ({ gymPayoutAmount: ci.gymPayoutAmount })),
      ),
      checkIns: enriched,
    });
  } catch (err) {
    console.error("getUnpaidCheckIns error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// PROCESS PAYOUT  (Admin only — marks check-ins as paid)
///////////////////////////////////////////////////////////////

const processPayout = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Admin only" });

    const { gymId } = req.params;
    const { checkInIds, payoutMethod, notes } = req.body;

    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      select: { id: true, name: true, ownerId: true, gymTier: true },
    });

    if (!gym)
      return res.status(404).json({ success: false, message: "Gym not found" });

    const whereClause = {
      gymId,
      isPaidToGym: false,
      ...(checkInIds?.length ? { id: { in: checkInIds } } : {}),
    };

    const unpaidCheckIns = await prisma.checkIn.findMany({
      where: whereClause,
      select: {
        id: true,
        gymPayoutAmount: true,
        platformAmount: true,
        memberTierSlug: true,
        userId: true,
        checkedInAt: true,
      },
    });

    if (unpaidCheckIns.length === 0)
      return res.status(400).json({
        success: false,
        message: "No unpaid check-ins found for this gym",
      });

    const totalGymPKR = sumGymPayouts(unpaidCheckIns);
    const totalPlatformPKR = unpaidCheckIns.reduce(
      (sum, ci) => sum + (ci.platformAmount ?? 0),
      0,
    );

    // Mark all as paid in one transaction
    await prisma.$transaction(
      unpaidCheckIns.map((ci) =>
        prisma.checkIn.update({
          where: { id: ci.id },
          data: { isPaidToGym: true },
        }),
      ),
    );

    await prisma.adminAuditLog.create({
      data: {
        adminId: req.user.id,
        action: "PROCESSED_PAYOUT",
        entityType: "Gym",
        entityId: gymId,
        metadata: {
          checkInsPaid: unpaidCheckIns.length,
          totalGymPKR,
          totalPlatformPKR,
          payoutMethod: payoutMethod || "manual",
          notes: notes || null,
          gymName: gym.name,
          ownerId: gym.ownerId,
        },
      },
    });

    return res.json({
      success: true,
      message: `Payout processed for ${unpaidCheckIns.length} check-ins`,
      payout: {
        gymId,
        gymName: gym.name,
        checkInsPaid: unpaidCheckIns.length,
        totalGymPKR,
        totalPlatformPKR,
        payoutMethod: payoutMethod || "manual",
        processedAt: new Date().toISOString(),
        notes: notes || null,
      },
    });
  } catch (err) {
    console.error("processPayout error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// GET PAYOUT HISTORY FOR A GYM
///////////////////////////////////////////////////////////////

const getPayoutHistory = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { id: userId, role: userRole } = req.user;

    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      select: { id: true, name: true, ownerId: true, gymTier: true },
    });

    if (!gym)
      return res.status(404).json({ success: false, message: "Gym not found" });
    if (userRole !== "admin" && gym.ownerId !== userId)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const paidCheckIns = await prisma.checkIn.findMany({
      where: { gymId, isPaidToGym: true },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { checkedInAt: "desc" },
    });

    // Group by YYYY-MM
    const monthlySummary = {};
    paidCheckIns.forEach((ci) => {
      const month = ci.checkedInAt.toISOString().slice(0, 7);
      if (!monthlySummary[month])
        monthlySummary[month] = {
          visits: 0,
          gymAmountPKR: 0,
          platformAmountPKR: 0,
        };

      monthlySummary[month].visits += 1;
      monthlySummary[month].gymAmountPKR += ci.gymPayoutAmount ?? 0;
      monthlySummary[month].platformAmountPKR += ci.platformAmount ?? 0;
    });

    return res.json({
      success: true,
      gymId,
      gymName: gym.name,
      gymTier: gym.gymTier,
      totalPaidCheckIns: paidCheckIns.length,
      totalPaidAmountPKR: sumGymPayouts(
        paidCheckIns.map((ci) => ({ gymPayoutAmount: ci.gymPayoutAmount })),
      ),
      monthlyBreakdown: monthlySummary,
      checkIns: paidCheckIns.map((ci) => ({
        id: ci.id,
        user: ci.user,
        checkedInAt: ci.checkedInAt,
        memberTierSlug: ci.memberTierSlug,
        gymPayoutAmount: ci.gymPayoutAmount,
        platformAmount: ci.platformAmount,
      })),
    });
  } catch (err) {
    console.error("getPayoutHistory error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// ADMIN: ALL GYMS PAYOUT OVERVIEW
///////////////////////////////////////////////////////////////

const getAllGymsPayoutOverview = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Admin only" });

    const gyms = await prisma.gym.findMany({
      where: { isArchived: false },
      include: { owner: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    const overview = await Promise.all(
      gyms.map(async (gym) => {
        const [unpaid, paid] = await Promise.all([
          prisma.checkIn.aggregate({
            where: { gymId: gym.id, isPaidToGym: false },
            _count: { id: true },
            _sum: { gymPayoutAmount: true },
          }),
          prisma.checkIn.aggregate({
            where: { gymId: gym.id, isPaidToGym: true },
            _count: { id: true },
            _sum: { gymPayoutAmount: true },
          }),
        ]);

        return {
          gymId: gym.id,
          gymName: gym.name,
          gymTier: gym.gymTier,
          owner: gym.owner,
          status: gym.status,
          isBlocked: gym.isBlocked,
          unpaidVisits: unpaid._count.id,
          unpaidAmountPKR: unpaid._sum.gymPayoutAmount ?? 0,
          paidVisits: paid._count.id,
          paidAmountPKR: paid._sum.gymPayoutAmount ?? 0,
          totalVisits: unpaid._count.id + paid._count.id,
        };
      }),
    );

    const totalUnpaidPKR = overview.reduce(
      (sum, g) => sum + g.unpaidAmountPKR,
      0,
    );
    const totalPaidPKR = overview.reduce((sum, g) => sum + g.paidAmountPKR, 0);

    return res.json({
      success: true,
      summary: {
        totalGyms: overview.length,
        totalUnpaidPKR,
        totalPaidPKR,
        netPayablePKR: totalUnpaidPKR,
      },
      gyms: overview,
    });
  } catch (err) {
    console.error("getAllGymsPayoutOverview error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// ADMIN: LIST ALL PAYOUT RATES FROM DB
///////////////////////////////////////////////////////////////

const getPayoutRates = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Admin only" });

    const rates = await prisma.payoutRate.findMany({
      orderBy: [{ memberTierSlug: "asc" }, { gymTier: "asc" }],
    });

    return res.json({ success: true, count: rates.length, rates });
  } catch (err) {
    console.error("getPayoutRates error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// ADMIN: UPDATE A PAYOUT RATE ROW
///////////////////////////////////////////////////////////////

const updatePayoutRate = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Admin only" });

    const { memberTierSlug, gymTier, gymGets, platformKeeps, multiplier } =
      req.body;

    if (!memberTierSlug || !gymTier || gymGets == null || platformKeeps == null)
      return res.status(400).json({
        success: false,
        message:
          "memberTierSlug, gymTier, gymGets, and platformKeeps are required",
      });

    const rate = await prisma.payoutRate.upsert({
      where: {
        memberTierSlug_gymTier: { memberTierSlug, gymTier },
      },
      update: {
        gymGets: parseInt(gymGets),
        platformKeeps: parseInt(platformKeeps),
        ...(multiplier != null ? { multiplier: parseFloat(multiplier) } : {}),
      },
      create: {
        memberTierSlug,
        gymTier,
        gymGets: parseInt(gymGets),
        platformKeeps: parseInt(platformKeeps),
        multiplier: multiplier ? parseFloat(multiplier) : 1.0,
      },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: req.user.id,
        action: "UPDATED_PAYOUT_RATE",
        entityType: "PayoutRate",
        entityId: rate.id,
        metadata: {
          memberTierSlug,
          gymTier,
          gymGets: rate.gymGets,
          platformKeeps: rate.platformKeeps,
          multiplier: rate.multiplier,
        },
      },
    });

    return res.json({ success: true, message: "Payout rate updated", rate });
  } catch (err) {
    console.error("updatePayoutRate error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// ADMIN: GET PAYOUT AUDIT LOGS
///////////////////////////////////////////////////////////////

const getPayoutAuditLogs = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Admin only" });

    const { gymId } = req.query;
    const where = { action: "PROCESSED_PAYOUT" };
    if (gymId) where.entityId = gymId;

    const logs = await prisma.adminAuditLog.findMany({
      where,
      include: { admin: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return res.json({
      success: true,
      count: logs.length,
      logs: logs.map((log) => ({
        id: log.id,
        admin: log.admin,
        action: log.action,
        gymId: log.entityId,
        metadata: log.metadata,
        createdAt: log.createdAt,
      })),
    });
  } catch (err) {
    console.error("getPayoutAuditLogs error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

///////////////////////////////////////////////////////////////
// EXPORTS
// fetchPayoutRate + resolveUserTierSlug used by checkInController
///////////////////////////////////////////////////////////////

module.exports = {
  fetchPayoutRate,
  resolveUserTierSlug,

  getGymPayoutSummary,
  getUnpaidCheckIns,
  processPayout,
  getPayoutHistory,
  getAllGymsPayoutOverview,
  getPayoutRates,
  updatePayoutRate,
  getPayoutAuditLogs,
};

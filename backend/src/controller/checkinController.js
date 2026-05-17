const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

module.exports = {
  checkIn: async (req, res) => {
    try {
      const userId = req.user.id;
      const gymId = req.gym.id;
      const now = new Date();

      console.log("===== CHECK-IN START =====");
      console.log("User ID:", userId);
      console.log("Gym ID:", gymId);

      // -------------------- FETCH SUBSCRIPTION --------------------
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: "active",
          endAt: { gte: new Date() },
        },
        include: {
          tier: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      console.log("Subscription row:", subscription);
      console.log("Tier row:", subscription?.tier);

      if (!subscription) {
        console.log("❌ No active subscription found");
        return res.status(403).json({
          message: "Active subscription required to check in",
        });
      }

      // -------------------- FETCH GYM --------------------
      const gym = await prisma.gym.findUnique({
        where: { id: gymId },
      });

      console.log("Gym row:", gym);

      if (!gym) {
        console.log("❌ Gym not found");
        return res.status(404).json({ message: "Gym not found" });
      }

      // -------------------- TIER CHECK (ENABLED) --------------------
      // FIXED: Use gym.tier (Int field), not gym.tier.accessTier
      const userTier = subscription.tier?.accessTier ?? 0;
      const gymTier = gym.tier ?? 1; // gym.tier is Int?, default to 1 if null

      console.log("===== TIER DEBUG =====");
      console.log("User accessTier:", userTier, "TYPE:", typeof userTier);
      console.log("Gym tier:", gymTier, "TYPE:", typeof gymTier);
      console.log("===== END TIER DEBUG =====");

      // 🔑 TIER ENFORCEMENT ENABLED
      if (userTier < gymTier) {
        console.log(`❌ Tier mismatch: User ${userTier} < Gym ${gymTier}`);
        return res.status(403).json({
          message: `Your Tier ${userTier} subscription cannot access Tier ${gymTier} gyms. Please upgrade your plan.`,
          code: "TIER_MISMATCH",
          userTier: userTier,
          requiredTier: gymTier,
        });
      }

      console.log("✅ Tier check passed");

      // -------------------- 24-HOUR CHECK (FIXED) --------------------
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const existing = await prisma.checkIn.findFirst({
        where: {
          userId,
          gymId,
          checkedInAt: {
            gte: twentyFourHoursAgo, // FIXED: Last 24 hours, not same day
          },
        },
        orderBy: {
          checkedInAt: "desc",
        },
      });

      console.log("Existing check-in in last 24h:", existing);

      if (existing) {
        const lastCheckIn = new Date(existing.checkedInAt);
        const nextAllowed = new Date(
          lastCheckIn.getTime() + 24 * 60 * 60 * 1000,
        );
        const hoursRemaining = Math.ceil(
          (nextAllowed - now) / (1000 * 60 * 60),
        );
        const minutesRemaining =
          Math.ceil((nextAllowed - now) / (1000 * 60)) % 60;

        console.log(
          `❌ Already checked in. Next allowed in ${hoursRemaining}h ${minutesRemaining}m`,
        );

        return res.status(429).json({
          message: `You already checked in to this gym within the last 24 hours. Next check-in available in ${hoursRemaining} hours ${minutesRemaining > 0 ? minutesRemaining + " minutes" : ""}.`,
          code: "CHECKIN_LIMIT",
          lastCheckIn: lastCheckIn,
          nextAllowed: nextAllowed,
          hoursRemaining: hoursRemaining,
        });
      }

      // -------------------- RECORD CHECK-IN --------------------
      await prisma.checkIn.create({
        data: {
          userId,
          gymId,
          checkedInAt: now,
          qrJti: req.qrPayload.jti,
        },
      });

      console.log("✅ CHECK-IN SAVED SUCCESSFULLY");
      console.log("===== CHECK-IN END =====");

      res.json({
        success: true,
        message: "Check-in successful",
        tier: userTier,
      });
    } catch (err) {
      console.error("🔥 CHECK-IN ERROR:", err);
      res.status(500).json({
        message: "Error recording check-in",
        detail: err.message,
      });
    }
  },
};

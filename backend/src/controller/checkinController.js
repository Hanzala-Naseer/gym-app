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

      // -------------------- FETCH SUBSCRIPTION (DEBUG) --------------------
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

      // -------------------- FETCH GYM (DEBUG) --------------------
      const gym = await prisma.gym.findUnique({
        where: { id: gymId },
      });

      console.log("Gym row:", gym);

      if (!gym) {
        console.log("❌ Gym not found");
        return res.status(404).json({ message: "Gym not found" });
      }

      // -------------------- PRINT TIER VALUES & TYPES --------------------
      console.log("===== TIER DEBUG =====");
      console.log(
        "User accessTier:",
        subscription.tier.accessTier,
        "TYPE:",
        typeof subscription.tier.accessTier
      );
      console.log("Gym tier:", gym.tier, "TYPE:", typeof gym.tier);
      console.log("===== END TIER DEBUG =====");

      // ⛔ TEMP: DO NOT BLOCK CHECK-IN YET
      console.log("⚠️ Tier enforcement temporarily skipped");

      // -------------------- DAILY DUPLICATE CHECK --------------------
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const existing = await prisma.checkIn.findFirst({
        where: {
          userId,
          gymId,
          checkedInAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      console.log("Existing check-in today:", existing);

      if (existing) {
        return res.status(400).json({
          message: "You have already checked in today for this gym",
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
        message: "Check-in successful (debug mode)",
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

// const prisma = require("../prismaClient");

// module.exports = {
//   checkIn: async (req, res) => {
//     try {
//       const userId = req.user.id;
//       const gymId = req.gym.id;
//       const now = new Date();

//       // -------------------- ACTIVE SUBSCRIPTION --------------------
//       const subscription = await prisma.subscription.findFirst({
//         where: {
//           userId,
//           status: "active",
//           endAt: { gte: new Date() },
//         },
//         include: {
//           tier: true,
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       });

//       if (!subscription) {
//         return res.status(403).json({
//           message: "Active subscription required to check in",
//         });
//       }

//       // -------------------- TIER HIERARCHY CHECK --------------------
//       const userTier = subscription.tier.accessTier; // 1, 2, 3
//       const gymTier = req.gym.tier;                  // 1, 2, 3

//       if (
//         typeof userTier !== "number" ||
//         typeof gymTier !== "number"
//       ) {
//         console.error("❌ Invalid tier configuration", {
//           userTier,
//           gymTier,
//         });

//         return res.status(500).json({
//           message: "Invalid tier configuration",
//         });
//       }

//       // 🔑 CORE RULE (THIS IS THE MAGIC)
//       if (userTier < gymTier) {
//         return res.status(403).json({
//           message: `Your Tier ${userTier} subscription cannot access Tier ${gymTier} gyms`,
//         });
//       }

//       // -------------------- DAILY DUPLICATE CHECK --------------------
//       const startOfDay = new Date();
//       startOfDay.setHours(0, 0, 0, 0);

//       const endOfDay = new Date();
//       endOfDay.setHours(23, 59, 59, 999);

//       const existing = await prisma.checkIn.findFirst({
//         where: {
//           userId,
//           gymId,
//           checkedInAt: {
//             gte: startOfDay,
//             lte: endOfDay,
//           },
//         },
//       });

//       if (existing) {
//         return res.status(400).json({
//           message: "You have already checked in today for this gym",
//         });
//       }

//       // -------------------- RECORD CHECK-IN --------------------
//       await prisma.checkIn.create({
//         data: {
//           userId,
//           gymId,
//           checkedInAt: now,
//           qrJti: req.qrPayload.jti,
//         },
//       });

//       res.json({
//         success: true,
//         message: "Check-in successful",
//         subscriptionTier: userTier,
//         gymTier: gymTier,
//       });
//     } catch (err) {
//       console.error("🔥 Check-in error:", err);
//       res.status(500).json({
//         message: "Error recording check-in",
//         detail: err.message,
//       });
//     }
//   },
// };

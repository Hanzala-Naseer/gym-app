// // const express = require("express");
// // const router = express.Router();
// // const auth = require("../middleware/auth");
// // const { authorizeRoles } = require("../middleware/roleMiddleware");
// // const subscriptionCtrl = require("../controller/subscriptionController");
// // const payoutCtrl = require("../controller/payoutController");
// // const { PrismaClient } = require("../generated/prisma");
// // const prisma = new PrismaClient();

// // // ============================================================
// // // PUBLIC ROUTES (No auth required)
// // // ============================================================

// // // Get all active plans for public display (marketing/landing)
// // router.get("/plans", subscriptionCtrl.getAllPlans);

// // // Get tiers by gym access level (BASIC/ULTIMATE/ELITE)
// // router.get("/plans/by-gym-tier/:gymTier", subscriptionCtrl.getPlansByGymTier);

// // // Get single plan details
// // router.get("/plans/:id", subscriptionCtrl.getPlanById);

// // // ============================================================
// // // USER ROUTES (Auth required)
// // // ============================================================

// // // Create Stripe checkout session
// // router.post(
// //   "/create-session",
// //   auth,
// //   authorizeRoles(["user"]),
// //   subscriptionCtrl.createSubscriptionSession,
// // );

// // // Get current user's subscription status
// // router.get("/status", auth, async (req, res) => {
// //   try {
// //     const userId = req.user.id;

// //     const subscription = await prisma.subscription.findFirst({
// //       where: {
// //         userId,
// //         status: "active",
// //         endAt: { gte: new Date() },
// //       },
// //       orderBy: { createdAt: "desc" },
// //       include: {
// //         tier: true,
// //       },
// //     });

// //     if (!subscription) {
// //       return res.json({
// //         hasActiveSubscription: false,
// //         activePlan: null,
// //         expiresAt: null,
// //         remainingVisits: null,
// //         isUnlimited: null,
// //       });
// //     }

// //     res.json({
// //       hasActiveSubscription: true,
// //       activePlan: subscription.tier.name,
// //       accessTier: subscription.tier.accessTier,
// //       gymTierAccess: subscription.tier.gymTierAccess,
// //       monthlyVisitLimit: subscription.tier.monthlyVisitLimit,
// //       isUnlimited: subscription.tier.isUnlimited,
// //       remainingVisits: subscription.remainingVisits,
// //       expiresAt: subscription.endAt,
// //     });
// //   } catch (err) {
// //     console.error("Subscription status error:", err);
// //     res.status(500).json({ error: "Server error" });
// //   }
// // });

// // // Get user's visit history
// // router.get("/my-visits", auth, subscriptionCtrl.getMyVisits);

// // // ============================================================
// // // ADMIN: TIER MANAGEMENT
// // // ============================================================

// // // List all tiers (admin view with inactive)
// // router.get(
// //   "/admin/tiers",
// //   auth,
// //   authorizeRoles(["admin"]),
// //   subscriptionCtrl.listAllTiers,
// // );

// // // Create new tier
// // router.post(
// //   "/admin/tiers",
// //   auth,
// //   authorizeRoles(["admin"]),
// //   subscriptionCtrl.createTier,
// // );

// // // Update tier
// // router.patch(
// //   "/admin/tiers/:id",
// //   auth,
// //   authorizeRoles(["admin"]),
// //   subscriptionCtrl.updateTier,
// // );

// // // Deactivate tier (soft delete)
// // router.delete(
// //   "/admin/tiers/:id",
// //   auth,
// //   authorizeRoles(["admin"]),
// //   subscriptionCtrl.deactivateTier,
// // );

// // // ============================================================
// // // ADMIN: PRICE MANAGEMENT
// // // ============================================================

// // // Create Stripe price + DB record
// // router.post(
// //   "/admin/prices",
// //   auth,
// //   authorizeRoles(["admin"]),
// //   subscriptionCtrl.createPrice,
// // );

// // // Update price (deactivates old, creates new Stripe price)
// // router.patch(
// //   "/admin/prices/:id",
// //   auth,
// //   authorizeRoles(["admin"]),
// //   subscriptionCtrl.updatePrice,
// // );

// // // Deactivate price
// // router.delete(
// //   "/admin/prices/:id",
// //   auth,
// //   authorizeRoles(["admin"]),
// //   subscriptionCtrl.deactivatePrice,
// // );

// // // Sync Stripe prices with DB
// // router.post(
// //   "/admin/sync-stripe",
// //   auth,
// //   authorizeRoles(["admin"]),
// //   subscriptionCtrl.syncStripePrices,
// // );

// // // ============================================================
// // // ADMIN: PAYOUT MANAGEMENT
// // // ============================================================

// // // Get all gyms payout overview
// // router.get(
// //   "/admin/payouts/overview",
// //   auth,
// //   authorizeRoles(["admin"]),
// //   payoutCtrl.getAllGymsPayoutOverview,
// // );

// // // Get payout audit logs
// // router.get(
// //   "/admin/payouts/audit-logs",
// //   auth,
// //   authorizeRoles(["admin"]),
// //   payoutCtrl.getPayoutAuditLogs,
// // );

// // // Process payout for a gym
// // router.post(
// //   "/admin/payouts/gym/:gymId",
// //   auth,
// //   authorizeRoles(["admin"]),
// //   payoutCtrl.processPayout,
// // );

// // // Update gym payout rate
// // router.patch(
// //   "/admin/payouts/gym/:gymId/rate",
// //   auth,
// //   authorizeRoles(["admin"]),
// //   payoutCtrl.updatePayoutRate,
// // );

// // // ============================================================
// // // GYM OWNER: PAYOUT VIEWS
// // // ============================================================

// // // Get my gym's payout summary
// // router.get(
// //   "/payouts/gym/:gymId/summary",
// //   auth,
// //   authorizeRoles(["owner", "admin"]),
// //   payoutCtrl.getGymPayoutSummary,
// // );

// // // Get unpaid check-ins
// // router.get(
// //   "/payouts/gym/:gymId/unpaid",
// //   auth,
// //   authorizeRoles(["owner", "admin"]),
// //   payoutCtrl.getUnpaidCheckIns,
// // );

// // // Get payout history
// // router.get(
// //   "/payouts/gym/:gymId/history",
// //   auth,
// //   authorizeRoles(["owner", "admin"]),
// //   payoutCtrl.getPayoutHistory,
// // );

// // // ============================================================
// // // WEBHOOK (Stripe - no auth, verify signature)
// // // ============================================================

// // router.post(
// //   "/webhook",
// //   express.raw({ type: "application/json" }),
// //   subscriptionCtrl.stripeWebhook,
// // );

// // module.exports = router;
// // src/routes/subscriptionRoutes.js
// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const { authorizeRoles } = require("../middleware/roleMiddleware");
// const subscriptionCtrl = require("../controller/subscriptionController");
// const payoutCtrl = require("../controller/payoutController");
// const { PrismaClient } = require("../generated/prisma");
// const prisma = new PrismaClient();

// // ============================================================
// // PUBLIC ROUTES (No auth required)
// // ============================================================

// // Get all plans for public display
// router.get("/plans", subscriptionCtrl.getAllPlans);

// // Get public tiers (marketing/landing)
// router.get("/public-tiers", subscriptionCtrl.getPublicTiers);

// // Get tiers by gym access level
// router.get(
//   "/public-tiers/gym-tier/:gymTier",
//   subscriptionCtrl.getTiersByGymAccess,
// );

// // ============================================================
// // USER ROUTES (Auth required)
// // ============================================================

// // Create Stripe checkout session
// router.post(
//   "/create-session",
//   auth,
//   authorizeRoles(["user"]),
//   subscriptionCtrl.createSubscriptionSession,
// );

// // Get user's active subscription status
// router.get("/status", auth, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const subscription = await prisma.subscription.findFirst({
//       where: {
//         userId,
//         status: "active",
//         endAt: { gte: new Date() },
//       },
//       orderBy: { createdAt: "desc" },
//       include: {
//         tier: {
//           select: {
//             name: true,
//             accessTier: true,
//             gymTierAccess: true,
//             monthlyVisitLimit: true,
//             isUnlimited: true,
//             perks: true,
//           },
//         },
//       },
//     });

//     if (!subscription) {
//       return res.json({
//         hasActiveSubscription: false,
//         activePlan: null,
//         expiresAt: null,
//         remainingVisits: null,
//       });
//     }

//     res.json({
//       hasActiveSubscription: true,
//       activePlan: subscription.tier.name,
//       accessTier: subscription.tier.accessTier,
//       gymTierAccess: subscription.tier.gymTierAccess,
//       monthlyVisitLimit: subscription.tier.monthlyVisitLimit,
//       isUnlimited: subscription.tier.isUnlimited,
//       perks: subscription.tier.perks,
//       remainingVisits: subscription.remainingVisits,
//       expiresAt: subscription.endAt,
//     });
//   } catch (err) {
//     console.error("Subscription status error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ============================================================
// // ADMIN ROUTES (Auth + Admin role)
// // ============================================================

// // Tier management
// router.get(
//   "/admin/tiers",
//   auth,
//   authorizeRoles(["admin"]),
//   subscriptionCtrl.listTiers,
// );

// router.get(
//   "/admin/tiers/:id",
//   auth,
//   authorizeRoles(["admin"]),
//   subscriptionCtrl.getTierById,
// );

// router.post(
//   "/admin/tiers",
//   auth,
//   authorizeRoles(["admin"]),
//   subscriptionCtrl.createTier,
// );

// router.patch(
//   "/admin/tiers/:id",
//   auth,
//   authorizeRoles(["admin"]),
//   subscriptionCtrl.updateTier,
// );

// router.delete(
//   "/admin/tiers/:id",
//   auth,
//   authorizeRoles(["admin"]),
//   subscriptionCtrl.deactivateTier,
// );

// // Price management
// router.post(
//   "/admin/prices",
//   auth,
//   authorizeRoles(["admin"]),
//   subscriptionCtrl.createPrice,
// );

// router.patch(
//   "/admin/prices/:id",
//   auth,
//   authorizeRoles(["admin"]),
//   subscriptionCtrl.updatePrice,
// );

// router.delete(
//   "/admin/prices/:id",
//   auth,
//   authorizeRoles(["admin"]),
//   subscriptionCtrl.deactivatePrice,
// );

// router.post(
//   "/admin/sync-stripe",
//   auth,
//   authorizeRoles(["admin"]),
//   subscriptionCtrl.syncStripePrices,
// );

// // ============================================================
// // PAYOUT ROUTES (Mixed: Owner/Admin)
// // ============================================================

// // Gym owner / admin views
// router.get(
//   "/payout/gym/:gymId/summary",
//   auth,
//   authorizeRoles(["admin", "owner"]),
//   payoutCtrl.getGymPayoutSummary,
// );

// router.get(
//   "/payout/gym/:gymId/unpaid",
//   auth,
//   authorizeRoles(["admin", "owner"]),
//   payoutCtrl.getUnpaidCheckIns,
// );

// router.get(
//   "/payout/gym/:gymId/history",
//   auth,
//   authorizeRoles(["admin", "owner"]),
//   payoutCtrl.getPayoutHistory,
// );

// // Admin only payout actions
// router.post(
//   "/payout/gym/:gymId/process",
//   auth,
//   authorizeRoles(["admin"]),
//   payoutCtrl.processPayout,
// );

// router.patch(
//   "/payout/gym/:gymId/rate",
//   auth,
//   authorizeRoles(["admin"]),
//   payoutCtrl.updatePayoutRate,
// );

// router.get(
//   "/payout/admin/overview",
//   auth,
//   authorizeRoles(["admin"]),
//   payoutCtrl.getAllGymsPayoutOverview,
// );

// router.get(
//   "/payout/admin/audit-logs",
//   auth,
//   authorizeRoles(["admin"]),
//   payoutCtrl.getPayoutAuditLogs,
// );

// module.exports = router;
// src/routes/subscriptionRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const subscriptionCtrl = require("../controller/subscriptionController");
const payoutCtrl = require("../controller/payoutController");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// ============================================================
// PUBLIC ROUTES (No auth required)
// ============================================================

router.get("/plans", subscriptionCtrl.getAllPlans);
router.get("/public-tiers", subscriptionCtrl.getPublicTiers);
router.get(
  "/public-tiers/gym-tier/:gymTier",
  subscriptionCtrl.getTiersByGymAccess,
);

// ============================================================
// USER ROUTES (Auth required)
// ============================================================

router.post(
  "/create-session",
  auth,
  authorizeRoles(["user"]),
  subscriptionCtrl.createSubscriptionSession,
);

router.get("/status", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "active",
        endAt: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
      include: {
        tier: {
          select: {
            name: true,
            accessTier: true,
            gymTierAccess: true,
            monthlyVisitLimit: true,
            isUnlimited: true,
            perks: true,
          },
        },
      },
    });

    if (!subscription) {
      return res.json({
        hasActiveSubscription: false,
        activePlan: null,
        expiresAt: null,
        remainingVisits: null,
        gymTierAccess: null,
        isUnlimited: null,
        perks: null,
      });
    }

    res.json({
      hasActiveSubscription: true,
      activePlan: subscription.tier.name,
      accessTier: subscription.tier.accessTier,
      gymTierAccess: subscription.tier.gymTierAccess,
      monthlyVisitLimit: subscription.tier.monthlyVisitLimit,
      isUnlimited: subscription.tier.isUnlimited,
      perks: subscription.tier.perks,
      remainingVisits: subscription.remainingVisits,
      expiresAt: subscription.endAt,
    });
  } catch (err) {
    console.error("Subscription status error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
// ADMIN: TIER MANAGEMENT
// ============================================================

router.get(
  "/admin/tiers",
  auth,
  authorizeRoles(["admin"]),
  subscriptionCtrl.listTiers,
);
router.get(
  "/admin/tiers/:id",
  auth,
  authorizeRoles(["admin"]),
  subscriptionCtrl.getTierById,
);
router.post(
  "/admin/tiers",
  auth,
  authorizeRoles(["admin"]),
  subscriptionCtrl.createTier,
);
router.patch(
  "/admin/tiers/:id",
  auth,
  authorizeRoles(["admin"]),
  subscriptionCtrl.updateTier,
);
router.delete(
  "/admin/tiers/:id",
  auth,
  authorizeRoles(["admin"]),
  subscriptionCtrl.deactivateTier,
);

// ============================================================
// ADMIN: PRICE MANAGEMENT
// ============================================================

router.post(
  "/admin/prices",
  auth,
  authorizeRoles(["admin"]),
  subscriptionCtrl.createPrice,
);
router.patch(
  "/admin/prices/:id",
  auth,
  authorizeRoles(["admin"]),
  subscriptionCtrl.updatePrice,
);
router.delete(
  "/admin/prices/:id",
  auth,
  authorizeRoles(["admin"]),
  subscriptionCtrl.deactivatePrice,
);
router.post(
  "/admin/sync-stripe",
  auth,
  authorizeRoles(["admin"]),
  subscriptionCtrl.syncStripePrices,
);

// ============================================================
// PAYOUT ROUTES (Owner + Admin)
// ============================================================

// Gym owner / admin views
router.get(
  "/payout/gym/:gymId/summary",
  auth,
  authorizeRoles(["admin", "owner"]),
  payoutCtrl.getGymPayoutSummary,
);
router.get(
  "/payout/gym/:gymId/unpaid",
  auth,
  authorizeRoles(["admin", "owner"]),
  payoutCtrl.getUnpaidCheckIns,
);
router.get(
  "/payout/gym/:gymId/history",
  auth,
  authorizeRoles(["admin", "owner"]),
  payoutCtrl.getPayoutHistory,
);

// Admin only payout actions
router.post(
  "/payout/gym/:gymId/process",
  auth,
  authorizeRoles(["admin"]),
  payoutCtrl.processPayout,
);
router.patch(
  "/payout/gym/:gymId/rate",
  auth,
  authorizeRoles(["admin"]),
  payoutCtrl.updatePayoutRate,
);
router.get(
  "/payout/admin/overview",
  auth,
  authorizeRoles(["admin"]),
  payoutCtrl.getAllGymsPayoutOverview,
);
router.get(
  "/payout/admin/audit-logs",
  auth,
  authorizeRoles(["admin"]),
  payoutCtrl.getPayoutAuditLogs,
);

module.exports = router;

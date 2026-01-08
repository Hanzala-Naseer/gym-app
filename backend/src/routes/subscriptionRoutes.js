// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const { authorizeRoles } = require("../middleware/roleMiddleware");
// const subscriptionCtrl = require("../controller/subscriptionController");
// const prisma = require("../prismaClient");
// router.get(
//   "/plans",
//   subscriptionCtrl.getAllPlans // Should be accessible without logging in
// );

// // Create Stripe Checkout Session
// router.post(
//   "/create-session",
//   auth,
//   authorizeRoles(["user"]),
//   subscriptionCtrl.createSubscriptionSession
// );

// router.get("/status", auth, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const subscription = await prisma.subscription.findFirst({
//       where: {
//         userId,
//         status: "active",
//         endAt: { gte: new Date() }, // make sure still valid
//       },
//       include: {
//         tier: true,
//       },
//     });

//     if (!subscription) {
//       return res.json({
//         hasActiveSubscription: false,
//         activePlan: null,
//         expiresAt: null,
//       });
//     }

//     res.json({
//       hasActiveSubscription: true,
//       activePlan: subscription.tier.name,
//       accessTier: subscription.tier.accessTier,
//       expiresAt: subscription.endAt,
//     });
//   } catch (err) {
//     console.error("Subscription status error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });
// module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const subscriptionCtrl = require("../controller/subscriptionController");
const prisma = require("../prismaClient");

// -------------------- PLANS (PUBLIC) --------------------
router.get("/plans", subscriptionCtrl.getAllPlans);


// -------------------- CREATE SESSION --------------------
router.post(
  "/create-session",
  auth,
  authorizeRoles(["user"]),
  subscriptionCtrl.createSubscriptionSession
);

// -------------------- SUBSCRIPTION STATUS --------------------
router.get("/status", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "active",
        endAt: { gte: new Date() },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tier: true,
      },
    });

    if (!subscription) {
      return res.json({
        hasActiveSubscription: false,
        activePlan: null,
        expiresAt: null,
      });
    }

    res.json({
      hasActiveSubscription: true,
      activePlan: subscription.tier.name,
      accessTier: subscription.tier.accessTier,
      expiresAt: subscription.endAt,
    });
  } catch (err) {
    console.error("Subscription status error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

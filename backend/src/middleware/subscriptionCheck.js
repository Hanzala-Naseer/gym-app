// const prisma = require("../prismaClient");

// module.exports = async function subscriptionCheck(req, res, next) {
//   try {
//     const activeSub = await prisma.subscription.findFirst({
//       where: {
//         userId: req.user.id,
//         gymId: req.gym.id,
//         status: "active",
//         startAt: { lte: new Date() },
//         endAt: { gte: new Date() },
//       },
//       include: {
//         tier: true, // important! attach the tier
//       },
//     });

//     if (!activeSub)
//       return res.status(403).json({ message: "No active subscription" });

//     req.subscription = activeSub;
//     req.tier = activeSub.tier; // attach tier for tierCheck
//     next();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error checking subscription" });
//   }
// };
// File: ../middleware/subscriptionCheck.js (Updated)

const prisma = require("../prismaClient");

module.exports = async function subscriptionCheck(req, res, next) {
  try {
    // 1. Find the user's single, highest tier active subscription
    const activeSub = await prisma.subscription.findFirst({
      where: {
        userId: req.user.id,
        // 🔑 CRITICAL FIX: REMOVE THE gymId FILTER.
        // The tier check handles the gym access.
        status: "active",
        startAt: { lte: new Date() },
        endAt: { gte: new Date() },
      },
      // Order by tier (assuming higher number is better) to get the best one
      orderBy: {
        tierId: "desc", // Change 'tierId' based on your actual schema relationship
      },
      include: {
        tier: true, // We still need the tier data for the next middleware
      },
    });

    if (!activeSub) {
      // 🛑 User has no active subscription at all
      return res.status(403).json({
        message: "No active subscription found. Please purchase a plan.",
      });
    }

    // Attach the subscription and its tier for the next middleware
    req.subscription = activeSub;
    // Make sure the access path to the tier is correct based on your schema
    req.tier = activeSub.tier;

    next(); // Proceed to tierCheck
  } catch (err) {
    console.error("SUBSCRIPTION CHECK CRASHED:", err);
    res.status(500).json({
      message: "Error checking subscription",
      detail: err.message || err.toString(),
    });
  }
};

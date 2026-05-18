// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const { authorizeRoles } = require("../middleware/roleMiddleware");
// const payoutCtrl = require("../controller/payoutController");

// // Gym owner / admin
// router.get(
//   "/gym/:gymId/summary",
//   auth,
//   authorizeRoles(["admin", "owner"]),
//   payoutCtrl.getGymPayoutSummary,
// );
// router.get(
//   "/gym/:gymId/unpaid",
//   auth,
//   authorizeRoles(["admin", "owner"]),
//   payoutCtrl.getUnpaidCheckIns,
// );
// router.get(
//   "/gym/:gymId/history",
//   auth,
//   authorizeRoles(["admin", "owner"]),
//   payoutCtrl.getPayoutHistory,
// );

// // Admin only
// router.post(
//   "/gym/:gymId/process",
//   auth,
//   authorizeRoles(["admin"]),
//   payoutCtrl.processPayout,
// );
// router.patch(
//   "/gym/:gymId/rate",
//   auth,
//   authorizeRoles(["admin"]),
//   payoutCtrl.updatePayoutRate,
// );
// router.get(
//   "/admin/overview",
//   auth,
//   authorizeRoles(["admin"]),
//   payoutCtrl.getAllGymsPayoutOverview,
// );
// router.get(
//   "/admin/audit-logs",
//   auth,
//   authorizeRoles(["admin"]),
//   payoutCtrl.getPayoutAuditLogs,
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const payoutCtrl = require("../controller/payoutController");

///////////////////////////////////////////////////////////////
// OWNER + ADMIN
///////////////////////////////////////////////////////////////

router.get(
  "/gym/:gymId/summary",
  auth,
  authorizeRoles(["admin", "owner"]),
  payoutCtrl.getGymPayoutSummary,
);

router.get(
  "/gym/:gymId/unpaid",
  auth,
  authorizeRoles(["admin", "owner"]),
  payoutCtrl.getUnpaidCheckIns,
);

router.get(
  "/gym/:gymId/history",
  auth,
  authorizeRoles(["admin", "owner"]),
  payoutCtrl.getPayoutHistory,
);

///////////////////////////////////////////////////////////////
// ADMIN ONLY
///////////////////////////////////////////////////////////////

router.post(
  "/gym/:gymId/process",
  auth,
  authorizeRoles(["admin"]),
  payoutCtrl.processPayout,
);

// NEW: view the full PayoutRate matrix from DB
router.get(
  "/admin/rates",
  auth,
  authorizeRoles(["admin"]),
  payoutCtrl.getPayoutRates,
);

// CHANGED: was PATCH /gym/:gymId/rate (per-gym flat rate)
//          now  PUT  /admin/rates     (matrix row upsert by memberTierSlug + gymTier)
router.put(
  "/admin/rates",
  auth,
  authorizeRoles(["admin"]),
  payoutCtrl.updatePayoutRate,
);

router.get(
  "/admin/overview",
  auth,
  authorizeRoles(["admin"]),
  payoutCtrl.getAllGymsPayoutOverview,
);

router.get(
  "/admin/audit-logs",
  auth,
  authorizeRoles(["admin"]),
  payoutCtrl.getPayoutAuditLogs,
);

module.exports = router;

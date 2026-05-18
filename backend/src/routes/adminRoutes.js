// const express = require("express");

// const router = express.Router();

// const adminCtrl = require("../controller/adminController");

// const auth = require("../middleware/auth");

// const { authorizeRoles } = require("../middleware/roleMiddleware");

// ///////////////////////////////////////////////////////
// // ADMIN ONLY MIDDLEWARE
// ///////////////////////////////////////////////////////

// const adminOnly = [auth, authorizeRoles(["admin"])];

// ///////////////////////////////////////////////////////
// // ANALYTICS
// ///////////////////////////////////////////////////////

// router.get("/analytics", adminOnly, adminCtrl.getDashboardAnalytics);

// ///////////////////////////////////////////////////////
// // QR
// ///////////////////////////////////////////////////////

// router.post("/generate-qr", adminOnly, adminCtrl.generateQr);

// ///////////////////////////////////////////////////////
// // GYMS
// ///////////////////////////////////////////////////////

// router.get("/gyms", adminOnly, adminCtrl.listAllGyms);

// router.patch("/gyms/:id/approve", adminOnly, adminCtrl.approveGym);

// router.patch("/gyms/:id/reject", adminOnly, adminCtrl.rejectGym);

// router.delete("/gyms/:id", adminOnly, adminCtrl.deleteGym);

// ///////////////////////////////////////////////////////
// // USERS
// ///////////////////////////////////////////////////////

// router.post("/owners/register", adminOnly, adminCtrl.registerOwner);

// router.get("/users", adminOnly, adminCtrl.listUsers);

// router.patch("/users/:id/deactivate", adminOnly, adminCtrl.deactivateUser);

// router.delete("/users/:id", adminOnly, adminCtrl.deleteUser);

// ///////////////////////////////////////////////////////
// // CHECKINS
// ///////////////////////////////////////////////////////

// router.get("/checkins", adminOnly, adminCtrl.listAllCheckins);

// module.exports = router;
// src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminCtrl = require("../controller/adminController");
const subscriptionCtrl = require("../controller/subscriptionController");
const auth = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");

///////////////////////////////////////////////////////
// ADMIN ONLY MIDDLEWARE
///////////////////////////////////////////////////////

const adminOnly = [auth, authorizeRoles(["admin"])];

///////////////////////////////////////////////////////
// ANALYTICS
///////////////////////////////////////////////////////

router.get("/analytics", adminOnly, adminCtrl.getDashboardAnalytics);

///////////////////////////////////////////////////////
// QR
///////////////////////////////////////////////////////

router.post("/generate-qr", adminOnly, adminCtrl.generateQr);

///////////////////////////////////////////////////////
// GYMS
///////////////////////////////////////////////////////

router.get("/gyms", adminOnly, adminCtrl.listAllGyms);
router.patch("/gyms/:id/approve", adminOnly, adminCtrl.approveGym);
router.patch("/gyms/:id/reject", adminOnly, adminCtrl.rejectGym);
router.delete("/gyms/:id", adminOnly, adminCtrl.deleteGym);
router.patch("/gyms/:id/tier", adminOnly, adminCtrl.updateGymTier);
router.delete("/gyms/:id/hard", adminOnly, adminCtrl.hardDeleteGym);

///////////////////////////////////////////////////////
// USERS
///////////////////////////////////////////////////////

router.post("/owners/register", adminOnly, adminCtrl.registerOwner);
router.get("/users", adminOnly, adminCtrl.listUsers);
router.delete("/users/:id", adminOnly, adminCtrl.deleteUser);

///////////////////////////////////////////////////////
// CHECKINS
///////////////////////////////////////////////////////

router.get("/checkins", adminOnly, adminCtrl.listAllCheckins);

///////////////////////////////////////////////////////
// SUBSCRIPTION TIERS & PRICING (Using subscriptionController)
///////////////////////////////////////////////////////

// Tiers
router.get("/subscription-tiers", adminOnly, subscriptionCtrl.listTiers);
router.post("/subscription-tiers", adminOnly, subscriptionCtrl.createTier);
router.patch("/subscription-tiers/:id", adminOnly, subscriptionCtrl.updateTier);
router.delete(
  "/subscription-tiers/:id",
  adminOnly,
  subscriptionCtrl.deactivateTier,
);

// Prices (Stripe-synced)
router.post("/subscription-prices", adminOnly, subscriptionCtrl.createPrice);
router.patch(
  "/subscription-prices/:id",
  adminOnly,
  subscriptionCtrl.updatePrice,
);
router.delete(
  "/subscription-prices/:id",
  adminOnly,
  subscriptionCtrl.deactivatePrice,
);

// Sync utility
router.post("/subscription-sync", adminOnly, subscriptionCtrl.syncStripePrices);

module.exports = router;

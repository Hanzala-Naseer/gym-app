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
const express = require("express");
const router = express.Router();
const adminCtrl = require("../controller/adminController");
const adminSubCtrl = require("../controller/adminSubscriptionController");
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
router.delete("/gyms/:id/hard", adminOnly, adminCtrl.hardDeleteGym); // ← ADDED

///////////////////////////////////////////////////////
// USERS
///////////////////////////////////////////////////////

router.post("/owners/register", adminOnly, adminCtrl.registerOwner);
router.get("/users", adminOnly, adminCtrl.listUsers);
// REMOVED: router.patch("/users/:id/deactivate", adminOnly, adminCtrl.deactivateUser);
router.delete("/users/:id", adminOnly, adminCtrl.deleteUser);

///////////////////////////////////////////////////////
// CHECKINS
///////////////////////////////////////////////////////

router.get("/checkins", adminOnly, adminCtrl.listAllCheckins);

///////////////////////////////////////////////////////
// SUBSCRIPTION TIERS & PRICING
///////////////////////////////////////////////////////

// Tiers
router.get("/subscription-tiers", adminSubCtrl.listTiers);
router.post("/subscription-tiers", adminOnly, adminSubCtrl.createTier);
router.patch("/subscription-tiers/:id", adminOnly, adminSubCtrl.updateTier);

// Prices (Stripe-synced)
router.post("/subscription-prices", adminOnly, adminSubCtrl.createPrice);
router.patch("/subscription-prices/:id", adminOnly, adminSubCtrl.updatePrice);
router.delete(
  "/subscription-prices/:id",
  adminOnly,
  adminSubCtrl.deactivatePrice,
);

// Sync utility
router.post("/subscription-sync", adminOnly, adminSubCtrl.syncStripePrices);

module.exports = router;

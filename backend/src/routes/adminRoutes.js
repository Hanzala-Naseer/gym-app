// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const adminCtrl = require("../controller/adminController");
// const auth = require("../middleware/auth");
// const { authorizeRoles } = require("../middleware/roleMiddleware");

// router.post("/generate-qr", adminCtrl.generateQr);

// // ---------------- Gym Management (admin only) ----------------
// router.get("/gyms", auth, authorizeRoles(["admin"]), adminCtrl.listAllGyms);
// router.patch(
//   "/gyms/:id/approve",
//   auth,
//   authorizeRoles(["admin"]),
//   adminCtrl.approveGym
// );
// router.patch(
//   "/gyms/:id/reject",
//   auth,
//   authorizeRoles(["admin"]),
//   adminCtrl.rejectGym
// );
// router.delete(
//   "/gyms/:id",
//   auth,
//   authorizeRoles(["admin"]),
//   adminCtrl.deleteGym
// );

// // ---------------- User Management (admin only) ----------------
// router.post("/owners/register", auth, adminCtrl.registerOwner);
// router.get("/users", auth, authorizeRoles(["admin"]), adminCtrl.listUsers);
// router.patch(
//   "/users/:id/deactivate",
//   auth,
//   authorizeRoles(["admin"]),
//   adminCtrl.deactivateUser
// );
// router.delete(
//   "/users/:id",
//   auth,
//   authorizeRoles(["admin"]),
//   adminCtrl.deleteUser
// );
// router.get(
//   "/checkins",
//   auth,
//   authorizeRoles(["admin"]),
//   adminCtrl.listAllCheckins
// );

// module.exports = router;
const express = require("express");

const router = express.Router();

const adminCtrl = require("../controller/adminController");

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

///////////////////////////////////////////////////////
// USERS
///////////////////////////////////////////////////////

router.post("/owners/register", adminOnly, adminCtrl.registerOwner);

router.get("/users", adminOnly, adminCtrl.listUsers);

router.patch("/users/:id/deactivate", adminOnly, adminCtrl.deactivateUser);

router.delete("/users/:id", adminOnly, adminCtrl.deleteUser);

///////////////////////////////////////////////////////
// CHECKINS
///////////////////////////////////////////////////////

router.get("/checkins", adminOnly, adminCtrl.listAllCheckins);

module.exports = router;

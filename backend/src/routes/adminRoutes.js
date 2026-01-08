// const express = require("express");
// const router = express.Router();
// const adminCtrl = require("../controller/adminController");
// const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");

// // ---------------- Gym Management ----------------
// router.get("/gyms", auth, admin, adminCtrl.listAllGyms);
// router.patch("/gyms/:id/approve", auth, admin, adminCtrl.approveGym);
// router.patch("/gyms/:id/reject", auth, admin, adminCtrl.rejectGym);
// router.delete("/gyms/:id", auth, admin, adminCtrl.deleteGym);

// // ---------------- User Management ----------------
// router.get("/users", auth, admin, adminCtrl.listUsers);
// router.patch("/users/:id/deactivate", auth, admin, adminCtrl.deactivateUser);
// router.delete("/users/:id", auth, admin, adminCtrl.deleteUser);

// module.exports = router;
const express = require("express");
const router = express.Router();
const adminCtrl = require("../controller/adminController");
const auth = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post("/generate-qr", adminCtrl.generateQr);

// ---------------- Gym Management (admin only) ----------------
router.get("/gyms", auth, authorizeRoles(["admin"]), adminCtrl.listAllGyms);
router.patch(
  "/gyms/:id/approve",
  auth,
  authorizeRoles(["admin"]),
  adminCtrl.approveGym
);
router.patch(
  "/gyms/:id/reject",
  auth,
  authorizeRoles(["admin"]),
  adminCtrl.rejectGym
);
router.delete(
  "/gyms/:id",
  auth,
  authorizeRoles(["admin"]),
  adminCtrl.deleteGym
);

// ---------------- User Management (admin only) ----------------
router.post("/owners/register", auth, adminCtrl.registerOwner);
router.get("/users", auth, authorizeRoles(["admin"]), adminCtrl.listUsers);
router.patch(
  "/users/:id/deactivate",
  auth,
  authorizeRoles(["admin"]),
  adminCtrl.deactivateUser
);
router.delete(
  "/users/:id",
  auth,
  authorizeRoles(["admin"]),
  adminCtrl.deleteUser
);
router.get(
  "/checkins",
  auth,
  authorizeRoles(["admin"]),
  adminCtrl.listAllCheckins
);

module.exports = router;

const express = require("express");
const router = express.Router();
const gymCtrl = require("../controller/gymController");
const adminCtrl = require("../controller/adminController");
const auth = require("../middleware/auth");
const { upload } = require("../utils/uploadUtils");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// ---------------- Gym Routes ----------------

// Register gym (only owners)
router.post(
  "/register",
  auth,
  authorizeRoles(["owner"]),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "photos", maxCount: 5 },
    { name: "ownerCnic", maxCount: 1 },
    { name: "businessLicense", maxCount: 1 },
    { name: "ownershipProof", maxCount: 1 },
    { name: "utilityBill", maxCount: 1 },
  ]),
  gymCtrl.registerGym,
);

// List all gyms (admin or any authenticated user)
router.get(
  "/",
  auth,
  authorizeRoles(["admin", "owner", "member", "user"]),
  gymCtrl.listGyms,
);

// Get gym members (owner only)
router.get("/members", auth, authorizeRoles(["owner"]), gymCtrl.getGymMembers);

// Get single gym details (any authenticated user)
router.get(
  "/:id",
  auth,
  authorizeRoles(["admin", "owner", "member", "user"]),
  gymCtrl.getGym,
);

// Add photos to an existing gym (only owners of that gym)
router.post(
  "/:id/photos",
  auth,
  authorizeRoles(["owner"]),
  upload.array("photos", 5),
  gymCtrl.addGymPhotos,
);

// Resubmit gym (only owners)
router.patch(
  "/:id/resubmit",
  auth,
  authorizeRoles(["owner"]),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "photos", maxCount: 5 },
    { name: "ownerCnic", maxCount: 1 },
    { name: "businessLicense", maxCount: 1 },
    { name: "ownershipProof", maxCount: 1 },
    { name: "utilityBill", maxCount: 1 },
  ]),
  gymCtrl.resubmitGym,
);

// Update gym (only owners)
router.patch(
  "/:id",
  auth,
  authorizeRoles(["owner"]),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "photos", maxCount: 5 },
  ]),
  gymCtrl.updateGym,
);

// ---------------- ADMIN Routes (within gym routes) ----------------

// Admin review gym — approve/reject/changes_requested + assign tier
router.patch("/:id/review", auth, authorizeRoles(["admin"]), gymCtrl.reviewGym);

// Admin assign/update tier standalone
router.patch(
  "/:id/assign-tier",
  auth,
  authorizeRoles(["admin"]),
  gymCtrl.assignTier,
);

// Admin hard delete gym
router.delete("/:id", auth, authorizeRoles(["admin"]), adminCtrl.hardDeleteGym);

// Admin update gym tier
router.patch(
  "/:id/tier",
  auth,
  authorizeRoles(["admin"]),
  adminCtrl.updateGymTier,
);

module.exports = router;

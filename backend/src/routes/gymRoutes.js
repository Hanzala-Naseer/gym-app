const express = require("express");
const router = express.Router();
const gymCtrl = require("../controller/gymController");
const adminCtrl = require("../controller/adminController");
const auth = require("../middleware/auth"); // JWT middleware
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
router.patch(
  "/:id/resubmit",
  auth,
  authorizeRoles(["owner"]),
  gymCtrl.resubmitGym,
);
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
module.exports = router;

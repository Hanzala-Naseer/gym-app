const express = require("express");
const router = express.Router();
const memberCtrl = require("../controller/memberController");
const auth = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// ----------------------- PUBLIC -----------------------
// Member signup → generate OTP
// router.post("/register", memberCtrl.memberSignup);

// // Member verify OTP
// router.post("/verify-otp", memberCtrl.verifyMemberOtp);

// // Member login
// router.post("/login", memberCtrl.memberLogin);

// ----------------------- MEMBER ONLY -----------------------
// Get member profile
router.get(
  "/profile",
  auth,
  authorizeRoles(["user", "member"]),
  memberCtrl.getMemberProfile
);

// View all gyms
router.get(
  "/gyms",
  auth,
  authorizeRoles(["member", "user"]),
  memberCtrl.getAllGymsForMember
);

// View gym details
router.get(
  "/gyms/:gymId",
  auth,
  authorizeRoles(["member"]),
  memberCtrl.getGymDetailsForMember
);

module.exports = router;

const express = require("express");
const router = express.Router();
const ownerCtrl = require("../controller/ownerController");
const verifyOtpMiddleware = require("../middleware/verifyOtpMiddleware");
const { createLimiter } = require("../middleware/rateLimiter");
const auth = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// rate limiters
const ownerSignupLimiter = createLimiter({ windowMs: 60 * 1000, max: 5 });
const ownerOtpLimiter = createLimiter({ windowMs: 60 * 1000, max: 10 });
const ownerLoginLimiter = createLimiter({ windowMs: 60 * 1000, max: 10 });

// Owner registration routes
router.post("/register", ownerSignupLimiter, ownerCtrl.ownerSignup);
router.post(
  "/verify-otp",
  ownerOtpLimiter,
  verifyOtpMiddleware,
  ownerCtrl.verifyOwnerOtp
);
router.post("/login", ownerLoginLimiter, ownerCtrl.ownerLogin);
// routes/ownerRoutes.js
router.get("/my-gyms", auth, authorizeRoles(["owner"]), ownerCtrl.getMyGyms);

module.exports = router;

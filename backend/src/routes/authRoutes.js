const express = require("express");
const router = express.Router();
const authCtrl = require("../controller/authController");
const verifyOtpMiddleware = require("../middleware/verifyOtpMiddleware");
const { createLimiter } = require("../middleware/rateLimiter");
const auth = require("../middleware/auth");

// rate limiters (small windows)
const signupLimiter = createLimiter({ windowMs: 60 * 1000, max: 5 }); // 5 signup attempts / min per IP
const loginLimiter = createLimiter({ windowMs: 60 * 1000, max: 10 }); // 10 login / min per IP
const otpLimiter = createLimiter({ windowMs: 60 * 1000, max: 10 });

router.post("/signup", signupLimiter, authCtrl.signup);
router.post(
  "/verify-otp",
  otpLimiter,
  verifyOtpMiddleware,
  authCtrl.verifyOtpAndIssueToken
);
router.post("/resend-otp", otpLimiter, authCtrl.resendOtp);
router.post("/login", loginLimiter, authCtrl.login);
router.get("/me", auth, authCtrl.me);

module.exports = router;

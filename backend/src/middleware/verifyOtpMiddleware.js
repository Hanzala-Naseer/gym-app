

const { hashOtp } = require("../utils/otpUtils");
const pendingUsers = require("../temp/pendingUsers");

module.exports = async function verifyOtpMiddleware(req, res, next) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required" });
  }

  const pending = pendingUsers[email];

  if (!pending) {
    return res
      .status(400)
      .json({ success: false, message: "OTP expired or invalid" });
  }

  if (new Date() > pending.otpExpiresAt) {
    delete pendingUsers[email]; // cleanup expired OTP
    return res.status(400).json({
      success: false,
      message: "OTP expired. Please request a new OTP.",
    });
  }

  if ((pending.otpAttempts || 0) >= 5) {
    delete pendingUsers[email]; // cleanup after max attempts
    return res.status(429).json({
      success: false,
      message: "Maximum OTP attempts reached. Request new OTP.",
    });
  }

  if (hashOtp(otp) !== pending.otpHash) {
    pending.otpAttempts = (pending.otpAttempts || 0) + 1;
    return res.status(400).json({ success: false, message: "Incorrect OTP" });
  }

  // OTP is correct, attach pending user to request for controller
  req.pending = pending;

  next();
};

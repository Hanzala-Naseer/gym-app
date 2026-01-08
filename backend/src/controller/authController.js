const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");
const { generateOtp, hashOtp } = require("../utils/otpUtils");
const { signUserToken } = require("../utils/jwtUtils");
const nodemailer = require("nodemailer");
const pendingUsers = require("../temp/pendingUsers");
const validator = require("validator");

// Configure SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper to send OTP email
async function sendOtpEmail(to, otp) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  await transporter.sendMail({
    from,
    to,
    subject: "Your verification code",
    text: `Your verification code is: ${otp}\nThis code expires in ${
      process.env.OTP_EXP_MINUTES || 5
    } minutes.`,
  });
}

// ---------------- Signup: generate OTP ----------------
async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, email, password required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const otpMinutes = Number(process.env.OTP_EXP_MINUTES || 5);
    const otpExpiresAt = new Date(Date.now() + otpMinutes * 60 * 1000);

    pendingUsers[email] = { name, email, password, otpHash, otpExpiresAt };

    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("signup error", err);
    res
      .status(500)
      .json({ message: "Error during signup", detail: err.message });
  }
}

// ---------------- Verify OTP and issue JWT ----------------
async function verifyOtpAndIssueToken(req, res) {
  try {
    const { email, otp } = req.body;
    const pending = pendingUsers[email];

    if (!pending)
      return res.status(400).json({ message: "OTP expired or invalid" });
    if (new Date() > pending.otpExpiresAt)
      return res.status(400).json({ message: "OTP expired" });
    if (pending.otpHash !== hashOtp(otp))
      return res.status(400).json({ message: "Incorrect OTP" });

    const passwordHash = await bcrypt.hash(pending.password, 10);
    const user = await prisma.user.create({
      data: { name: pending.name, email: pending.email, passwordHash },
    });

    const token = signUserToken({ sub: user.id, role: user.role });
    delete pendingUsers[email];

    res.json({ success: true, message: "User registered successfully", token });
  } catch (err) {
    console.error("verifyOtpAndIssueToken", err);
    res
      .status(500)
      .json({ message: "Error verifying OTP", detail: err.message });
  }
}

// ---------------- Login ----------------
// async function login(req, res) {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return res.status(400).json({ message: "Email and password required" });

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const match = await bcrypt.compare(password, user.passwordHash);
//     if (!match) return res.status(401).json({ message: "Invalid password" });

//     const token = signUserToken({ sub: user.id, role: user.role });
//     res.json({ success: true, token });
//   } catch (err) {
//     console.error("login error", err);
//     res
//       .status(500)
//       .json({ message: "Error during login", detail: err.message });
//   }
// }

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    // Generate JWT token
    const token = signUserToken({ sub: user.id, role: user.role });

    // Send token + dynamic user data
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("login error", err);
    res
      .status(500)
      .json({ message: "Error during login", detail: err.message });
  }
}

// ---------------- Resend OTP ----------------
async function resendOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const pending = pendingUsers[email];
    if (!pending)
      return res.status(404).json({ message: "No pending signup found" });

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const otpMinutes = Number(process.env.OTP_EXP_MINUTES || 5);
    pending.otpHash = otpHash;
    pending.otpExpiresAt = new Date(Date.now() + otpMinutes * 60 * 1000);

    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP resent" });
  } catch (err) {
    console.error("resendOtp error", err);
    res
      .status(500)
      .json({ message: "Error resending OTP", detail: err.message });
  }
}

// ---------------- Get current user profile ----------------
async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        subscriptions: {
          where: { status: "active" },
          take: 1,
          include: { tier: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Send a single active subscription (or null)
    const activeSubscription = user.subscriptions[0] || null;

    res.json({ success: true, user: { ...user, activeSubscription } });
  } catch (err) {
    console.error("me error", err);
    res.status(500).json({ message: "Server error", detail: err.message });
  }
}

module.exports = {
  signup,
  verifyOtpAndIssueToken,
  login,
  resendOtp,
  me,
  sendOtpEmail,
};

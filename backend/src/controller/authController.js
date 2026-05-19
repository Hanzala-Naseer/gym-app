const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { generateOtp, hashOtp } = require("../utils/otpUtils");
const { signUserToken } = require("../utils/jwtUtils");
const nodemailer = require("nodemailer");
const pendingUsers = require("../temp/pendingUsers");
const validator = require("validator");
const crypto = require("crypto");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
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

async function sendOtpEmail(to, otp) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const expiry = process.env.OTP_EXP_MINUTES || 5;

  await transporter.sendMail({
    from: `"GymKey Corporation" <${from}>`,
    to,
    subject: "Verify your GymKey account",

    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

      <title>GymKey Verification</title>
    </head>

    <body style="
      margin:0;
      padding:24px 12px;
      background:#F4F7FB;
      font-family:'Inter', Arial, sans-serif;
    ">

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">

            <!-- MAIN CARD -->
            <table width="100%" cellpadding="0" cellspacing="0" style="
              max-width:520px;
              background:#FFFFFF;
              border-radius:18px;
              overflow:hidden;
              box-shadow:0 6px 18px rgba(10,22,40,0.08);
            ">

              <!-- HEADER -->
              <tr>
                <td style="
                  background:#10B981;
                  padding:28px 24px;
                  text-align:center;
                ">

                  <h1 style="
                    margin:0;
                    color:#FFFFFF;
                    font-size:30px;
                    font-weight:700;
                    letter-spacing:-0.5px;
                  ">
                    GymKey
                  </h1>

                  <p style="
                    margin:8px 0 0;
                    color:rgba(255,255,255,0.9);
                    font-size:13px;
                  ">
                    Smart Multi-Gym Membership Platform
                  </p>

                </td>
              </tr>

              <!-- CONTENT -->
              <tr>
                <td style="padding:34px 28px;">

                  <p style="
                    margin:0;
                    color:#6B7280;
                    font-size:13px;
                    font-weight:600;
                    letter-spacing:0.8px;
                  ">
                    ACCOUNT VERIFICATION
                  </p>

                  <h2 style="
                    margin:10px 0 16px;
                    color:#0A1628;
                    font-size:24px;
                    line-height:1.3;
                    font-weight:700;
                  ">
                    Verify your email
                  </h2>

                  <p style="
                    margin:0;
                    color:#4B5563;
                    font-size:15px;
                    line-height:1.7;
                  ">
                    Use the verification code below to complete your GymKey registration.
                  </p>

                  <!-- OTP -->
                  <div style="
                    text-align:center;
                    margin:28px 0;
                  ">

                    <div style="
                      display:inline-block;
                      background:#ECFDF5;
                      border:2px solid #10B981;
                      color:#10B981;
                      padding:16px 34px;
                      border-radius:14px;
                      font-size:34px;
                      font-weight:700;
                      letter-spacing:8px;
                    ">
                      ${otp}
                    </div>

                  </div>

                  <!-- INFO BOX -->
                  <div style="
                    background:#F9FAFB;
                    border-radius:12px;
                    padding:14px 16px;
                  ">

                    <p style="
                      margin:0;
                      color:#374151;
                      font-size:14px;
                      line-height:1.6;
                    ">
                      This code expires in
                      <strong>${expiry} minutes</strong>.
                    </p>

                  </div>

                  <p style="
                    margin:20px 0 0;
                    color:#6B7280;
                    font-size:13px;
                    line-height:1.7;
                  ">
                    If you did not request this email, you can safely ignore it.
                  </p>

                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="
                  background:#FAFAFA;
                  border-top:1px solid #E5E7EB;
                  padding:18px;
                  text-align:center;
                ">

                  <p style="
                    margin:0;
                    color:#6B7280;
                    font-size:12px;
                  ">
                    © ${new Date().getFullYear()} GymKey Corporation
                  </p>

                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
    `,
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
      data: {
        name: pending.name,
        email: pending.email,
        passwordHash,
      },
    });

    const token = signUserToken({
      sub: user.id,
      role: user.role,
    });

    delete pendingUsers[email];

    // ✅ RETURN USER ALSO
    res.json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (err) {
    console.error("verifyOtpAndIssueToken", err);

    res.status(500).json({
      message: "Error verifying OTP",
      detail: err.message,
    });
  }
}

// ================= FORGOT PASSWORD =================

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const tokenHash = crypto.createHash("sha256").update(otp).digest("hex");

    const expiresAt = new Date(
      Date.now() + (process.env.OTP_EXP_MINUTES || 5) * 60 * 1000,
    );

    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    await prisma.passwordResetToken.create({
      data: {
        email,
        tokenHash,
        expiresAt,
      },
    });

    await sendResetPasswordEmail(email, otp);

    res.json({
      success: true,
      message: "Reset OTP sent successfully",
    });
  } catch (err) {
    console.error("forgotPassword", err);

    res.status(500).json({
      message: "Failed to send reset OTP",
    });
  }
}

// ================= RESET PASSWORD =================

async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { email },
    });

    if (!resetToken) {
      return res.status(400).json({
        message: "OTP expired or invalid",
      });
    }

    if (new Date() > resetToken.expiresAt) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const incomingHash = crypto.createHash("sha256").update(otp).digest("hex");

    if (incomingHash !== resetToken.tokenHash) {
      return res.status(400).json({
        message: "Incorrect OTP",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("resetPassword", err);

    res.status(500).json({
      message: "Failed to reset password",
    });
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
        role: user.role,
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
  forgotPassword,
  resetPassword,
};

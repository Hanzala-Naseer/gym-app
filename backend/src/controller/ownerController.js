const prisma = require("../prismaClient");
const pendingOwners = require("../temp/pendingUsers");

const bcrypt = require("bcrypt");
const { generateOtp, hashOtp } = require("../utils/otpUtils");
const { sendOtpEmail } = require("./authController"); // reuse your existing email sender
const validator = require("validator");
const { signUserToken } = require("../utils/jwtUtils");

// In-memory store for pending owners

// ---------------- Owner Signup (generate OTP) ----------------
async function ownerSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ success: false, message: "Invalid email" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });

    // ✅ Use secret key internally
    const key = process.env.OWNER_REGISTRATION_KEY;

    // Generate OTP
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const otpMinutes = Number(process.env.OTP_EXP_MINUTES || 5);
    const otpExpiresAt = new Date(Date.now() + otpMinutes * 60 * 1000);

    pendingOwners[email] = {
      name,
      email,
      password,
      otpHash,
      otpExpiresAt,
      key,
    };

    // Send OTP
    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("ownerSignup error:", err);
    res.status(500).json({
      success: false,
      message: "Error during signup",
      detail: err.message,
    });
  }
}

// ---------------- Verify OTP and create owner ----------------
async function verifyOwnerOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const pending = pendingOwners[email];

    if (!pending)
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or invalid" });
    if (new Date() > pending.otpExpiresAt)
      return res.status(400).json({ success: false, message: "OTP expired" });
    if (pending.otpHash !== hashOtp(otp))
      return res.status(400).json({ success: false, message: "Incorrect OTP" });

    const passwordHash = await bcrypt.hash(pending.password, 10);

    const owner = await prisma.user.create({
      data: {
        name: pending.name,
        email: pending.email,
        passwordHash,
        role: "owner", // <-- important
      },
    });

    delete pendingOwners[email];

    res.json({
      success: true,
      message: "Owner registered successfully",
      owner,
    });
  } catch (err) {
    console.error("verifyOwnerOtp error:", err);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
      detail: err.message,
    });
  }
}
async function ownerLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      // 🔑 FIX: Select the necessary user fields AND nest a select for the related Gym ID(s).
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
        // Include the related 'gymsOwned' relation, selecting only the ID
        gymsOwned: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 🔑 EXTRACT gymId SAFELY:
    // This assumes an owner will manage only the first gym in the list (or the only one).
    const gymId =
      user.gymsOwned && user.gymsOwned.length > 0 ? user.gymsOwned[0].id : null; // Set to null if the user has no registered gym

    // 🔐 JWT includes role
    const token = signUserToken({
      sub: user.id,
      role: user.role,
    });

    // ✅ FRONTEND-FRIENDLY RESPONSE
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        // 🔑 Include the extracted gymId in the response
        gymId: gymId,
      },
    });
  } catch (err) {
    console.error("login error", err);
    return res.status(500).json({
      message: "Error during login",
      detail: err.message,
    });
  }
}
const getMyGyms = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Owners only",
      });
    }

    const gyms = await prisma.gym.findMany({
      where: {
        ownerId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ success: true, gyms });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching gyms",
    });
  }
};

module.exports = { ownerSignup, verifyOwnerOtp, ownerLogin, getMyGyms };

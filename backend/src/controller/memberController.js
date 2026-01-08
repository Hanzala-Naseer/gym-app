// const prisma = require("../prismaClient");
// const bcrypt = require("bcrypt");
// const validator = require("validator");
// const { generateOtp, hashOtp } = require("../utils/otpUtils");
// const { sendOtpEmail } = require("./authController");
// const { signUserToken } = require("../utils/jwtUtils");

// const { pendingMembers } = require("../temp/pendingUsers");

// // ---------------- Member Signup ----------------
// async function memberSignup(req, res) {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password)
//       return res
//         .status(400)
//         .json({ success: false, message: "All fields required" });

//     if (!validator.isEmail(email))
//       return res.status(400).json({ success: false, message: "Invalid email" });

//     const existing = await prisma.user.findUnique({ where: { email } });
//     if (existing)
//       return res
//         .status(400)
//         .json({ success: false, message: "Email already registered" });

//     const otp = generateOtp();
//     const otpHash = hashOtp(otp);
//     const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins default

//     pendingMembers[email] = { name, email, password, otpHash, otpExpiresAt };
//     await sendOtpEmail(email, otp);

//     res.json({ success: true, message: "OTP sent to email" });
//   } catch (err) {
//     console.error("memberSignup error:", err);
//     res
//       .status(500)
//       .json({ success: false, message: "Signup error", detail: err.message });
//   }
// }

// // ---------------- Verify OTP ----------------
// async function verifyMemberOtp(req, res) {
//   try {
//     const { email, otp } = req.body;
//     const pending = pendingMembers[email];

//     if (!pending)
//       return res
//         .status(400)
//         .json({ success: false, message: "OTP expired or invalid" });
//     if (new Date() > pending.otpExpiresAt)
//       return res.status(400).json({ success: false, message: "OTP expired" });
//     if (pending.otpHash !== hashOtp(otp))
//       return res.status(400).json({ success: false, message: "Incorrect OTP" });

//     const passwordHash = await bcrypt.hash(pending.password, 10);
//     const user = await prisma.user.create({
//       data: {
//         name: pending.name,
//         email: pending.email,
//         passwordHash,
//         role: "member",
//       },
//     });

//     delete pendingMembers[email];
//     res.json({
//       success: true,
//       message: "Member registered successfully",
//       user,
//     });
//   } catch (err) {
//     console.error("verifyMemberOtp error:", err);
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "OTP verification error",
//         detail: err.message,
//       });
//   }
// }

// // ---------------- Member Login ----------------
// async function memberLogin(req, res) {
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
//     res.status(500).json({ message: "Login error", detail: err.message });
//   }
// }

// // ---------------- Member Profile ----------------
// async function getMemberProfile(req, res) {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: req.user.sub },
//       select: { id: true, name: true, email: true, role: true },
//     });
//     res.json(user);
//   } catch (err) {
//     console.error("Profile error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }

// // ---------------- Gyms ----------------
// async function getAllGymsForMember(req, res) {
//   try {
//     const gyms = await prisma.gym.findMany({
//       select: {
//         id: true,
//         name: true,
//         location: true,
//         city: true,
//         timings: true,
//         image: true,
//       },
//     });
//     res.json(gyms);
//   } catch (err) {
//     console.error("Get gyms error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }

// async function getGymDetailsForMember(req, res) {
//   try {
//     const gym = await prisma.gym.findUnique({
//       where: { id: req.params.gymId },
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         location: true,
//         city: true,
//         timings: true,
//         tiers: true,
//         image: true,
//       },
//     });
//     if (!gym) return res.status(404).json({ message: "Gym not found" });
//     res.json(gym);
//   } catch (err) {
//     console.error("Gym detail error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }

// module.exports = {
//   memberSignup,
//   verifyMemberOtp,
//   memberLogin,
//   getMemberProfile,
//   getAllGymsForMember,
//   getGymDetailsForMember,
// };
const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { generateOtp, hashOtp } = require("../utils/otpUtils");
const { sendOtpEmail } = require("./authController");
const { signUserToken } = require("../utils/jwtUtils");

const { pendingMembers } = require("../temp/pendingUsers");

// ---------------- Member Signup ----------------
async function memberSignup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ success: false, message: "Invalid email" });

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    pendingMembers[normalizedEmail] = {
      name,
      email: normalizedEmail,
      password,
      otpHash,
      otpExpiresAt,
      otpAttempts: 0,
    };

    console.log("Pending Members after signup:", pendingMembers);

    await sendOtpEmail(normalizedEmail, otp);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("memberSignup error:", err);
    res
      .status(500)
      .json({ success: false, message: "Signup error", detail: err.message });
  }
}

// ---------------- Verify OTP ----------------
async function verifyMemberOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    console.log("OTP verify request:", { email: normalizedEmail, otp });
    console.log("Pending Members at verification:", pendingMembers);

    const pending = pendingMembers[normalizedEmail];

    if (!pending)
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or invalid" });

    if (new Date() > pending.otpExpiresAt) {
      delete pendingMembers[normalizedEmail];
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP.",
      });
    }

    if (pending.otpAttempts >= 5) {
      delete pendingMembers[normalizedEmail];
      return res.status(429).json({
        success: false,
        message: "Maximum OTP attempts reached. Request new OTP.",
      });
    }

    if (pending.otpHash !== hashOtp(otp)) {
      pending.otpAttempts++;
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }

    const passwordHash = await bcrypt.hash(pending.password, 10);
    const user = await prisma.user.create({
      data: {
        name: pending.name,
        email: pending.email,
        passwordHash,
        role: "member",
      },
    });

    delete pendingMembers[normalizedEmail];

    const token = signUserToken({ sub: user.id, role: user.role });

    res.json({
      success: true,
      message: "Member registered successfully",
      user,
      token,
    });
  } catch (err) {
    console.error("verifyMemberOtp error:", err);
    res.status(500).json({
      success: false,
      message: "OTP verification error",
      detail: err.message,
    });
  }
}

// ---------------- Member Login ----------------
async function memberLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = signUserToken({ sub: user.id, role: user.role });
    res.json({ success: true, token });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ message: "Login error", detail: err.message });
  }
}

// ---------------- Member Profile ----------------
async function getMemberProfile(req, res) {
  try {
    const userId = req.user?.id; // <-- use 'id', not 'sub'

    if (!userId) {
      return res.status(400).json({ message: "User info missing in token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptions: {
          where: { status: "active" },
          take: 1,
          include: { tier: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const activeSubscription =
      user.subscriptions.length > 0 ? user.subscriptions[0] : null;

    res.json({ ...user, activeSubscription });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// ---------------- Gyms ----------------
async function getAllGymsForMember(req, res) {
  try {
    const gyms = await prisma.gym.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        city: true,
        timings: true,
        image: true,
      },
    });
    res.json(gyms);
  } catch (err) {
    console.error("Get gyms error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getGymDetailsForMember(req, res) {
  try {
    const gym = await prisma.gym.findUnique({
      where: { id: req.params.gymId },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        city: true,
        timings: true,
        tiers: true,
        image: true,
      },
    });
    if (!gym) return res.status(404).json({ message: "Gym not found" });
    res.json(gym);
  } catch (err) {
    console.error("Gym detail error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  memberSignup,
  verifyMemberOtp,
  memberLogin,
  getMemberProfile,
  getAllGymsForMember,
  getGymDetailsForMember,
};

const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");
const QRCode = require("qrcode");
const { createQrToken } = require("../utils/jwtUtils");
const auth = require("../middleware/auth");

// // ------------------- Get Gym QR Data -------------------
// router.get("/:gymId/qr", async (req, res) => {
//   try {
//     const gym = await prisma.gym.findUnique({
//       where: { id: req.params.gymId },
//     });
//     if (!gym) return res.status(404).json({ message: "Gym not found" });

//     const qrData = gym.qrToken || "No QR generated yet";
//     const qrImage = await QRCode.toDataURL(qrData);

//     res.json({ gymId: gym.id, name: gym.name, qrData, qrImage });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.get("/:gymId/qr", auth, async (req, res) => {
  try {
    const { gymId } = req.params;

    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
    });

    if (!gym) return res.status(404).json({ message: "Gym not found" });

    // ❌ Block pending gyms
    if (gym.status !== "approved") {
      return res.status(403).json({
        message: "Gym not approved yet",
      });
    }

    // 🔐 Generate fresh 60s QR
    const { token, jti } = createQrToken({
      gymId,
      purpose: "CHECKIN",
    });

    res.json({
      gymId: gym.id,
      gymName: gym.name,
      qrToken: token,
      expiresIn: 60,
    });
  } catch (err) {
    console.error("QR error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ------------------- Get Gym Attendance -------------------
// router.get("/:gymId/attendance", async (req, res) => {
//   try {
//     const gym = await prisma.gym.findUnique({
//       where: { id: req.params.gymId },
//     });
//     if (!gym) return res.status(404).json({ message: "Gym not found" });

//     const attendance = await prisma.attendance.findMany({
//       where: { gymId: gym.id },
//       include: { user: { select: { id: true, name: true, email: true } } },
//       orderBy: { checkInAt: "desc" },
//     });

//     res.json({ gymId: gym.id, gymName: gym.name, attendance });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
router.get("/:gymId/attendance", auth, async (req, res) => {
  try {
    const { gymId } = req.params;

    const checkins = await prisma.checkIn.findMany({
      where: { gymId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { checkedInAt: "desc" },
    });

    res.json({ attendance: checkins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

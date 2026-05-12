const { verifyQrToken } = require("../utils/jwtUtils");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
module.exports = async function validateQrToken(req, res, next) {
  const { qrToken, gymId } = req.body;
  if (!qrToken) return res.status(400).json({ message: "QR token required" });

  try {
    const payload = verifyQrToken(qrToken);
    console.log("QR Payload", payload);

    // Check gym match
    if (gymId && payload.gymId !== gymId) {
      return res
        .status(403)
        .json({ message: "QR token does not belong to this gym" });
    }

    // Check expiry
    const now = Date.now() / 1000;
    if (payload.exp < now)
      return res.status(400).json({ message: "QR expired" });

    req.qrPayload = payload;
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Invalid QR token", detail: err.message });
  }
};

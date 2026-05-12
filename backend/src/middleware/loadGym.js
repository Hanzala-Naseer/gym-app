const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
module.exports = async function loadGym(req, res, next) {
  try {
    // Normalize gymId to lowercase to avoid UUID mismatch
    const gymId = req.qrPayload.gymId.toLowerCase();

    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
    });

    if (!gym) {
      console.log("Gym not found for ID:", gymId); // debug
      return res.status(404).json({ message: "Gym not found" });
    }

    req.gym = gym;
    next();
  } catch (err) {
    console.error("Error loading gym:", err);
    res.status(500).json({ message: "Error loading gym", detail: err.message });
  }
};

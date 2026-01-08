const prisma = require("../prismaClient");
const { createQrToken } = require("../utils/jwtUtils");

const generateQr = async (req, res) => {
  const { gymId } = req.body;
  const gym = await prisma.gym.findUnique({ where: { id: gymId } });
  if (!gym) return res.status(404).json({ message: "Gym not found" });

  const { token, jti } = createQrToken({ gymId });
  await prisma.gym.update({
    where: { id: gymId },
    data: {
      qrToken: token,
      qrTokenJti: jti,
      qrTokenExpiresAt: new Date(Date.now() + 60 * 1000),
    },
  });

  res.json({ qrToken: token, expiresAt: new Date(Date.now() + 60 * 1000) });
};

// -------------------- Gym Management --------------------

// List all gyms (pending, approved, rejected)
const listAllGyms = async (req, res) => {
  try {
    // Admin only
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view all gyms",
      });
    }

    const {
      status, // pending | approved | rejected
      search, // gym name search
      page = 1,
      limit = 10,
    } = req.query;

    const where = {};

    // Status filter
    if (status) {
      where.status = status;
    }

    // Search by gym name
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [gyms, total] = await Promise.all([
      prisma.gym.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          photos: true,
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.gym.count({ where }),
    ]);

    // Dashboard counts
    const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
      prisma.gym.count({ where: { status: "pending" } }),
      prisma.gym.count({ where: { status: "approved" } }),
      prisma.gym.count({ where: { status: "rejected" } }),
    ]);

    res.json({
      success: true,
      gyms,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
        counts: {
          total,
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount,
        },
      },
    });
  } catch (err) {
    console.error("listAllGyms error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching gyms",
      detail: err.message,
    });
  }
};

// Approve a gym
const approveGym = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;
    const gym = await prisma.gym.update({
      where: { id },
      data: { status: "approved" },
    });

    res.json({ success: true, message: "Gym approved", gym });
  } catch (err) {
    console.error("approveGym error:", err);
    res.status(500).json({
      success: false,
      message: "Error approving gym",
      detail: err.message,
    });
  }
};

// Reject a gym
const rejectGym = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;
    const gym = await prisma.gym.update({
      where: { id },
      data: { status: "rejected" },
    });

    res.json({ success: true, message: "Gym rejected", gym });
  } catch (err) {
    console.error("rejectGym error:", err);
    res.status(500).json({
      success: false,
      message: "Error rejecting gym",
      detail: err.message,
    });
  }
};

// Delete a gym
const deleteGym = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;
    await prisma.gym.delete({ where: { id } });

    res.json({ success: true, message: "Gym deleted" });
  } catch (err) {
    console.error("deleteGym error:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting gym",
      detail: err.message,
    });
  }
};

// -------------------- User Management --------------------

async function registerOwner(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const owner = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "owner", // forced
      },
    });

    res.json({
      success: true,
      message: "Owner registered successfully",
      owner,
    });
  } catch (err) {
    console.error("registerOwner error:", err);
    res
      .status(500)
      .json({ message: "Error creating owner", detail: err.message });
  }
}

// List all users
const listUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,

        createdAt: true,
      },
    });

    res.json({ success: true, users });
  } catch (err) {
    console.error("listUsers error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      detail: err.message,
    });
  }
};

// Deactivate a user
const deactivateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;

    // Prevent deactivating other admins
    const user = await prisma.user.findUnique({ where: { id } });
    if (user.role === "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Cannot deactivate another admin" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { active: false },
    });

    res.json({ success: true, message: "User deactivated", user: updatedUser });
  } catch (err) {
    console.error("deactivateUser error:", err);
    res.status(500).json({
      success: false,
      message: "Error deactivating user",
      detail: err.message,
    });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;

    // Prevent deleting other admins
    const user = await prisma.user.findUnique({ where: { id } });
    if (user.role === "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Cannot delete another admin" });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      detail: err.message,
    });
  }
};

const listAllCheckins = async (req, res) => {
  try {
    // extra safety (middleware already does this)
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin only",
      });
    }

    const { date } = req.query;

    // Filter by selected date (checkedInAt)
    const where = date
      ? {
          checkedInAt: {
            gte: new Date(`${date}T00:00:00.000Z`),
            lt: new Date(`${date}T23:59:59.999Z`),
          },
        }
      : {};

    const checkins = await prisma.checkIn.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        gym: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
      orderBy: {
        checkedInAt: "desc",
      },
    });

    res.json({
      success: true,
      checkins,
    });
  } catch (err) {
    console.error("listAllCheckins error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching check-ins",
      detail: err.message,
    });
  }
};

module.exports = {
  listAllGyms,
  approveGym,
  rejectGym,
  deleteGym,
  listUsers,
  deactivateUser,
  deleteUser,
  registerOwner,
  generateQr,
  listAllCheckins
};

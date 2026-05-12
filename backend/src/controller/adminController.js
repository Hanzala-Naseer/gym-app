// const { PrismaClient } = require("../generated/prisma");
// const prisma = new PrismaClient();
// const { createQrToken } = require("../utils/jwtUtils");

// const generateQr = async (req, res) => {
//   const { gymId } = req.body;
//   const gym = await prisma.gym.findUnique({ where: { id: gymId } });
//   if (!gym) return res.status(404).json({ message: "Gym not found" });

//   const { token, jti } = createQrToken({ gymId });
//   await prisma.gym.update({
//     where: { id: gymId },
//     data: {
//       qrToken: token,
//       qrTokenJti: jti,
//       qrTokenExpiresAt: new Date(Date.now() + 60 * 1000),
//     },
//   });

//   res.json({ qrToken: token, expiresAt: new Date(Date.now() + 60 * 1000) });
// };

// // -------------------- Gym Management --------------------

// // List all gyms (pending, approved, rejected)
// const listAllGyms = async (req, res) => {
//   try {
//     // Admin only
//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Only admins can view all gyms",
//       });
//     }

//     const {
//       status, // pending | approved | rejected
//       search, // gym name search
//       page = 1,
//       limit = 10,
//     } = req.query;

//     const where = {};

//     // Status filter
//     if (status) {
//       where.status = status;
//     }

//     // Search by gym name
//     if (search) {
//       where.name = {
//         contains: search,
//         mode: "insensitive",
//       };
//     }

//     const skip = (Number(page) - 1) * Number(limit);

//     const [gyms, total] = await Promise.all([
//       prisma.gym.findMany({
//         where,
//         skip,
//         take: Number(limit),
//         orderBy: { createdAt: "desc" },
//         include: {
//           photos: true,
//           owner: {
//             select: { id: true, name: true, email: true },
//           },
//         },
//       }),
//       prisma.gym.count({ where }),
//     ]);

//     // Dashboard counts
//     const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
//       prisma.gym.count({ where: { status: "pending" } }),
//       prisma.gym.count({ where: { status: "approved" } }),
//       prisma.gym.count({ where: { status: "rejected" } }),
//     ]);

//     res.json({
//       success: true,
//       gyms,
//       meta: {
//         total,
//         page: Number(page),
//         limit: Number(limit),
//         totalPages: Math.ceil(total / limit),
//         counts: {
//           total,
//           pending: pendingCount,
//           approved: approvedCount,
//           rejected: rejectedCount,
//         },
//       },
//     });
//   } catch (err) {
//     console.error("listAllGyms error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching gyms",
//       detail: err.message,
//     });
//   }
// };

// // Approve a gym
// const approveGym = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     const { id } = req.params;
//     const gym = await prisma.gym.update({
//       where: { id },
//       data: { status: "approved" },
//     });

//     res.json({ success: true, message: "Gym approved", gym });
//   } catch (err) {
//     console.error("approveGym error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error approving gym",
//       detail: err.message,
//     });
//   }
// };

// // Reject a gym
// const rejectGym = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     const { id } = req.params;
//     const gym = await prisma.gym.update({
//       where: { id },
//       data: { status: "rejected" },
//     });

//     res.json({ success: true, message: "Gym rejected", gym });
//   } catch (err) {
//     console.error("rejectGym error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error rejecting gym",
//       detail: err.message,
//     });
//   }
// };

// // Delete a gym
// const deleteGym = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     const { id } = req.params;
//     await prisma.gym.delete({ where: { id } });

//     res.json({ success: true, message: "Gym deleted" });
//   } catch (err) {
//     console.error("deleteGym error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting gym",
//       detail: err.message,
//     });
//   }
// };

// // -------------------- User Management --------------------

// async function registerOwner(req, res) {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password)
//       return res.status(400).json({ message: "All fields required" });

//     const existing = await prisma.user.findUnique({ where: { email } });
//     if (existing)
//       return res.status(400).json({ message: "Email already exists" });

//     const passwordHash = await bcrypt.hash(password, 10);
//     const owner = await prisma.user.create({
//       data: {
//         name,
//         email,
//         passwordHash,
//         role: "owner", // forced
//       },
//     });

//     res.json({
//       success: true,
//       message: "Owner registered successfully",
//       owner,
//     });
//   } catch (err) {
//     console.error("registerOwner error:", err);
//     res
//       .status(500)
//       .json({ message: "Error creating owner", detail: err.message });
//   }
// }

// // List all users
// const listUsers = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     const users = await prisma.user.findMany({
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,

//         createdAt: true,
//       },
//     });

//     res.json({ success: true, users });
//   } catch (err) {
//     console.error("listUsers error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching users",
//       detail: err.message,
//     });
//   }
// };

// // Deactivate a user
// const deactivateUser = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     const { id } = req.params;

//     // Prevent deactivating other admins
//     const user = await prisma.user.findUnique({ where: { id } });
//     if (user.role === "admin") {
//       return res
//         .status(403)
//         .json({ success: false, message: "Cannot deactivate another admin" });
//     }

//     const updatedUser = await prisma.user.update({
//       where: { id },
//       data: { active: false },
//     });

//     res.json({ success: true, message: "User deactivated", user: updatedUser });
//   } catch (err) {
//     console.error("deactivateUser error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error deactivating user",
//       detail: err.message,
//     });
//   }
// };

// // Delete a user
// const deleteUser = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     const { id } = req.params;

//     // Prevent deleting other admins
//     const user = await prisma.user.findUnique({ where: { id } });
//     if (user.role === "admin") {
//       return res
//         .status(403)
//         .json({ success: false, message: "Cannot delete another admin" });
//     }

//     await prisma.user.delete({ where: { id } });
//     res.json({ success: true, message: "User deleted" });
//   } catch (err) {
//     console.error("deleteUser error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting user",
//       detail: err.message,
//     });
//   }
// };

// const listAllCheckins = async (req, res) => {
//   try {
//     // extra safety (middleware already does this)
//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Admin only",
//       });
//     }

//     const { date } = req.query;

//     // Filter by selected date (checkedInAt)
//     const where = date
//       ? {
//           checkedInAt: {
//             gte: new Date(`${date}T00:00:00.000Z`),
//             lt: new Date(`${date}T23:59:59.999Z`),
//           },
//         }
//       : {};

//     const checkins = await prisma.checkIn.findMany({
//       where,
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         gym: {
//           select: {
//             id: true,
//             name: true,
//             city: true,
//           },
//         },
//       },
//       orderBy: {
//         checkedInAt: "desc",
//       },
//     });

//     res.json({
//       success: true,
//       checkins,
//     });
//   } catch (err) {
//     console.error("listAllCheckins error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching check-ins",
//       detail: err.message,
//     });
//   }
// };

// module.exports = {
//   listAllGyms,
//   approveGym,
//   rejectGym,
//   deleteGym,
//   listUsers,
//   deactivateUser,
//   deleteUser,
//   registerOwner,
//   generateQr,
//   listAllCheckins,
// };

const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const { createQrToken } = require("../utils/jwtUtils");

///////////////////////////////////////////////////////
// SMTP CONFIG
///////////////////////////////////////////////////////

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

///////////////////////////////////////////////////////
// EMAIL HELPERS
///////////////////////////////////////////////////////

const sendGymApprovalEmail = async ({ email, ownerName, gymName }) => {
  await transporter.sendMail({
    from: `"GymKey" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Gym Approved - GymKey",
    html: `
      <div style="font-family:Arial;padding:20px;">
        <h2>Congratulations ${ownerName} 🎉</h2>

        <p>
          Your gym <strong>${gymName}</strong>
          has been approved successfully.
        </p>

        <p>You can now access all GymKey features.</p>

        <p>— GymKey Team</p>
      </div>
    `,
  });
};

const sendGymRejectionEmail = async ({
  email,
  ownerName,
  gymName,
  rejectionReason,
}) => {
  await transporter.sendMail({
    from: `"GymKey" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Gym Application Update - GymKey",
    html: `
      <div style="font-family:Arial;padding:20px;">
        <h2>Hello ${ownerName}</h2>

        <p>
          Your gym application for
          <strong>${gymName}</strong>
          was not approved.
        </p>

        <p><strong>Reason:</strong></p>

        <div style="background:#f5f5f5;padding:12px;border-radius:8px;">
          ${rejectionReason}
        </div>

        <p style="margin-top:20px;">
          You may update the information and apply again.
        </p>

        <p>— GymKey Team</p>
      </div>
    `,
  });
};

///////////////////////////////////////////////////////
// QR GENERATION
///////////////////////////////////////////////////////

const generateQr = async (req, res) => {
  try {
    const { gymId } = req.body;

    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
    });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found",
      });
    }

    const { token, jti } = createQrToken({ gymId });

    res.json({
      success: true,
      qrToken: token,
      jti,
      expiresAt: new Date(Date.now() + 60 * 1000),
    });
  } catch (err) {
    console.error("generateQr error:", err);

    res.status(500).json({
      success: false,
      message: "QR generation failed",
    });
  }
};

///////////////////////////////////////////////////////
// DASHBOARD ANALYTICS
///////////////////////////////////////////////////////

const getDashboardAnalytics = async (req, res) => {
  try {
    const [
      totalGyms,
      pendingGyms,
      approvedGyms,
      rejectedGyms,
      totalUsers,
      totalOwners,
      totalMembers,
      activeSubscriptions,
      totalRevenue,
      totalCheckins,
    ] = await Promise.all([
      prisma.gym.count(),
      prisma.gym.count({ where: { status: "pending" } }),
      prisma.gym.count({ where: { status: "approved" } }),
      prisma.gym.count({ where: { status: "rejected" } }),

      prisma.user.count(),

      prisma.user.count({
        where: { role: "owner" },
      }),

      prisma.user.count({
        where: { role: "user" },
      }),

      prisma.subscription.count({
        where: { status: "active" },
      }),

      prisma.payment.aggregate({
        _sum: {
          amountCents: true,
        },
        where: {
          status: "succeeded",
        },
      }),

      prisma.checkIn.count(),
    ]);

    res.json({
      success: true,
      analytics: {
        gyms: {
          total: totalGyms,
          pending: pendingGyms,
          approved: approvedGyms,
          rejected: rejectedGyms,
        },

        users: {
          total: totalUsers,
          owners: totalOwners,
          members: totalMembers,
        },

        subscriptions: {
          active: activeSubscriptions,
        },

        revenue: {
          totalPkr: (totalRevenue._sum.amountCents || 0) / 100,
        },

        checkins: {
          total: totalCheckins,
        },
      },
    });
  } catch (err) {
    console.error("getDashboardAnalytics error:", err);

    res.status(500).json({
      success: false,
      message: "Analytics fetch failed",
    });
  }
};

///////////////////////////////////////////////////////
// LIST ALL GYMS
///////////////////////////////////////////////////////

const listAllGyms = async (req, res) => {
  try {
    const { status, city, search, page = 1, limit = 10 } = req.query;

    const where = {
      isArchived: false,
    };

    if (status) {
      where.status = status;
    }

    if (city) {
      where.city = city;
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          city: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [gyms, total] = await Promise.all([
      prisma.gym.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          createdAt: "desc",
        },
        include: {
          photos: true,

          verificationDocuments: true,

          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),

      prisma.gym.count({ where }),
    ]);

    res.json({
      success: true,
      gyms,

      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("listAllGyms error:", err);

    res.status(500).json({
      success: false,
      message: "Error fetching gyms",
    });
  }
};

///////////////////////////////////////////////////////
// APPROVE GYM
///////////////////////////////////////////////////////

const approveGym = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalNotes } = req.body;

    const existingGym = await prisma.gym.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });

    if (!existingGym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found",
      });
    }

    const gym = await prisma.gym.update({
      where: { id },

      data: {
        status: "approved",
        reviewedAt: new Date(),
        reviewedByAdminId: req.user.id,
        rejectionReason: null,
        approvalNotes,
      },

      include: {
        owner: true,
      },
    });

    // Audit log
    await prisma.adminAuditLog.create({
      data: {
        adminId: req.user.id,
        action: "APPROVED_GYM",
        entityType: "GYM",
        entityId: gym.id,
      },
    });

    // Email
    if (gym.owner?.email) {
      try {
        await sendGymApprovalEmail({
          email: gym.owner.email,
          ownerName: gym.owner.name,
          gymName: gym.name,
        });
      } catch (mailErr) {
        console.error(mailErr);
      }
    }

    res.json({
      success: true,
      message: "Gym approved successfully",
      gym,
    });
  } catch (err) {
    console.error("approveGym error:", err);

    res.status(500).json({
      success: false,
      message: "Error approving gym",
    });
  }
};

///////////////////////////////////////////////////////
// REJECT GYM
///////////////////////////////////////////////////////

const rejectGym = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Valid rejection reason required",
      });
    }

    const existingGym = await prisma.gym.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });

    if (!existingGym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found",
      });
    }

    const gym = await prisma.gym.update({
      where: { id },

      data: {
        status: "changes_requested",
        reviewedAt: new Date(),
        reviewedByAdminId: req.user.id,
        rejectionReason,
      },

      include: {
        owner: true,
      },
    });

    // Audit log
    await prisma.adminAuditLog.create({
      data: {
        adminId: req.user.id,
        action: "CHANGES_REQUESTED",
        entityType: "GYM",
        entityId: gym.id,

        metadata: {
          reason: rejectionReason,
        },
      },
    });

    // Email
    if (gym.owner?.email) {
      try {
        await sendGymRejectionEmail({
          email: gym.owner.email,
          ownerName: gym.owner.name,
          gymName: gym.name,
          rejectionReason,
        });
      } catch (mailErr) {
        console.error(mailErr);
      }
    }

    res.json({
      success: true,
      message: "Gym rejected successfully",
      gym,
    });
  } catch (err) {
    console.error("rejectGym error:", err);

    res.status(500).json({
      success: false,
      message: "Error rejecting gym",
    });
  }
};

///////////////////////////////////////////////////////
// ARCHIVE GYM (SOFT DELETE)
///////////////////////////////////////////////////////

const deleteGym = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.gym.update({
      where: { id },

      data: {
        isArchived: true,
      },
    });

    res.json({
      success: true,
      message: "Gym archived successfully",
    });
  } catch (err) {
    console.error("deleteGym error:", err);

    res.status(500).json({
      success: false,
      message: "Error archiving gym",
    });
  }
};

///////////////////////////////////////////////////////
// REGISTER OWNER
///////////////////////////////////////////////////////

const registerOwner = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const owner = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "owner",
      },
    });

    res.json({
      success: true,
      message: "Owner registered successfully",
      owner,
    });
  } catch (err) {
    console.error("registerOwner error:", err);

    res.status(500).json({
      success: false,
      message: "Error creating owner",
    });
  }
};

///////////////////////////////////////////////////////
// LIST USERS
///////////////////////////////////////////////////////

const listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isSuspended: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("listUsers error:", err);

    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

///////////////////////////////////////////////////////
// SUSPEND USER
///////////////////////////////////////////////////////

const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot suspend admin",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },

      data: {
        isSuspended: true,
        suspendedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "User suspended",
      user: updatedUser,
    });
  } catch (err) {
    console.error("deactivateUser error:", err);

    res.status(500).json({
      success: false,
      message: "Error suspending user",
    });
  }
};

///////////////////////////////////////////////////////
// DELETE USER
///////////////////////////////////////////////////////

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("deleteUser error:", err);

    res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
};

///////////////////////////////////////////////////////
// CHECKINS
///////////////////////////////////////////////////////

const listAllCheckins = async (req, res) => {
  try {
    const { date } = req.query;

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
    });
  }
};

///////////////////////////////////////////////////////
// EXPORTS
///////////////////////////////////////////////////////

module.exports = {
  generateQr,

  getDashboardAnalytics,

  listAllGyms,
  approveGym,
  rejectGym,
  deleteGym,

  registerOwner,

  listUsers,
  deactivateUser,
  deleteUser,

  listAllCheckins,
};

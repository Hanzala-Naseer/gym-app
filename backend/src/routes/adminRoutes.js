const express = require("express");
const router = express.Router();
const adminCtrl = require("../controller/adminController");
const subscriptionCtrl = require("../controller/subscriptionController");
const auth = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

///////////////////////////////////////////////////////
// ADMIN ONLY MIDDLEWARE
///////////////////////////////////////////////////////

const adminOnly = [auth, authorizeRoles(["admin"])];

///////////////////////////////////////////////////////
// ANALYTICS
///////////////////////////////////////////////////////

router.get("/analytics", adminOnly, adminCtrl.getDashboardAnalytics);

///////////////////////////////////////////////////////
// QR
///////////////////////////////////////////////////////

router.post("/generate-qr", adminOnly, adminCtrl.generateQr);

///////////////////////////////////////////////////////
// GYMS
///////////////////////////////////////////////////////

router.get("/gyms", adminOnly, adminCtrl.listAllGyms);
router.patch("/gyms/:id/approve", adminOnly, adminCtrl.approveGym);
router.patch("/gyms/:id/reject", adminOnly, adminCtrl.rejectGym);
router.delete("/gyms/:id", adminOnly, adminCtrl.deleteGym);
router.patch("/gyms/:id/tier", adminOnly, adminCtrl.updateGymTier);
router.delete("/gyms/:id/hard", adminOnly, adminCtrl.hardDeleteGym);

///////////////////////////////////////////////////////
// USERS
///////////////////////////////////////////////////////

router.post("/owners/register", adminOnly, adminCtrl.registerOwner);
router.get("/users", adminOnly, adminCtrl.listUsers);
router.delete("/users/:id", adminOnly, adminCtrl.deleteUser);

///////////////////////////////////////////////////////
// CHECKINS
///////////////////////////////////////////////////////

router.get("/checkins", adminOnly, adminCtrl.listAllCheckins);

///////////////////////////////////////////////////////
// SUBSCRIPTION TIERS & PRICING (Using subscriptionController)
///////////////////////////////////////////////////////

// Tiers
router.get("/subscription-tiers", adminOnly, subscriptionCtrl.listTiers);
router.post("/subscription-tiers", adminOnly, subscriptionCtrl.createTier);
router.patch("/subscription-tiers/:id", adminOnly, subscriptionCtrl.updateTier);
router.delete(
  "/subscription-tiers/:id",
  adminOnly,
  subscriptionCtrl.deactivateTier,
);

// Prices (Stripe-synced)
router.post("/subscription-prices", adminOnly, subscriptionCtrl.createPrice);
router.patch(
  "/subscription-prices/:id",
  adminOnly,
  subscriptionCtrl.updatePrice,
);
router.delete(
  "/subscription-prices/:id",
  adminOnly,
  subscriptionCtrl.deactivatePrice,
);

// Sync utility
router.post("/subscription-sync", adminOnly, subscriptionCtrl.syncStripePrices);

// routes/adminRoutes.js or similar

// Get admin notifications
router.get(
  "/admin/notifications",
  auth,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const { unread } = req.query;
      const where = { adminId: req.user.id };
      if (unread === "true") where.isRead = false;

      const notifications = await prisma.adminNotification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      res.json({ success: true, notifications });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// Mark notification as read
router.patch(
  "/admin/notifications/:id/read",
  auth,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const notification = await prisma.adminNotification.update({
        where: { id: req.params.id },
        data: { isRead: true },
      });
      res.json({ success: true, notification });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// Mark all as read
router.patch(
  "/admin/notifications/read-all",
  auth,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      await prisma.adminNotification.updateMany({
        where: { adminId: req.user.id, isRead: false },
        data: { isRead: true },
      });
      res.json({ success: true, message: "All marked as read" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// Get unread count
router.get(
  "/admin/notifications/unread-count",
  auth,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const count = await prisma.adminNotification.count({
        where: { adminId: req.user.id, isRead: false },
      });
      res.json({ success: true, count });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// Get all audit logs (not just payout-specific)
router.get(
  "/admin/audit-logs",
  auth,
  authorizeRoles(["admin"]),
  async (req, res) => {
    try {
      const { action, entityType, startDate, endDate, limit = 100 } = req.query;
      const where = {};

      if (action) where.action = action;
      if (entityType) where.entityType = entityType;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const logs = await prisma.adminAuditLog.findMany({
        where,
        include: {
          admin: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
      });

      res.json({ success: true, count: logs.length, logs });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

module.exports = router;

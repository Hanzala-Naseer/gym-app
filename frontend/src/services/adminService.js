// import api from "./api";

// export const adminService = {
//   // ─── Dashboard Analytics ───────────────────────────────────────────────────
//   getAnalytics: async () => {
//     const response = await api.get("/admin/analytics");
//     return response.data;
//   },

//   // ─── Gyms ──────────────────────────────────────────────────────────────────
//   getAllGyms: async ({ status, city, search, page = 1, limit = 10 } = {}) => {
//     const params = {};
//     if (status) params.status = status;
//     if (city) params.city = city;
//     if (search) params.search = search;
//     params.page = page;
//     params.limit = limit;
//     const response = await api.get("/admin/gyms", { params });
//     return response.data;
//   },

//   approveGym: async (gymId, approvalNotes = "") => {
//     const response = await api.patch(`/admin/gyms/${gymId}/approve`, {
//       approvalNotes,
//     });
//     return response.data;
//   },

//   rejectGym: async (gymId, rejectionReason) => {
//     const response = await api.patch(`/admin/gyms/${gymId}/reject`, {
//       rejectionReason,
//     });
//     return response.data;
//   },

//   archiveGym: async (gymId) => {
//     const response = await api.delete(`/admin/gyms/${gymId}`);
//     return response.data;
//   },

//   // ─── Users ─────────────────────────────────────────────────────────────────
//   getAllUsers: async () => {
//     const response = await api.get("/admin/users");
//     return response.data;
//   },

//   suspendUser: async (userId) => {
//     const response = await api.patch(`/admin/users/${userId}/deactivate`);
//     return response.data;
//   },

//   deleteUser: async (userId) => {
//     const response = await api.delete(`/admin/users/${userId}`);
//     return response.data;
//   },

//   registerOwner: async ({ name, email, password }) => {
//     const response = await api.post("/admin/owners/register", {
//       name,
//       email,
//       password,
//     });
//     return response.data;
//   },

//   // ─── Check-ins ─────────────────────────────────────────────────────────────
//   getCheckins: async (date = "") => {
//     const params = date ? { date } : {};
//     const response = await api.get("/admin/checkins", { params });
//     return response.data;
//   },

//   // ─── QR ────────────────────────────────────────────────────────────────────
//   generateQr: async (gymId) => {
//     const response = await api.post("/admin/generate-qr", { gymId });
//     return response.data;
//   },

//   reviewGym: async (gymId, payload) => {
//     const response = await api.patch(`/gyms/${gymId}/review`, payload);
//     return response.data;
//   },

//   // ─── Subscription Tiers ────────────────────────────────────────────────────
//   // UPDATED PATHS to match /subscription/admin/...
//   listSubscriptionTiers: async () => {
//     const res = await api.get("/subscription/admin/tiers");
//     return res.data;
//   },

//   getSubscriptionTier: async (id) => {
//     const res = await api.get(`/subscription/admin/tiers/${id}`);
//     return res.data;
//   },

//   createSubscriptionTier: async (payload) => {
//     const res = await api.post("/subscription/admin/tiers", payload);
//     return res.data;
//   },

//   updateSubscriptionTier: async (id, payload) => {
//     const res = await api.patch(`/subscription/admin/tiers/${id}`, payload);
//     return res.data;
//   },

//   deactivateSubscriptionTier: async (id) => {
//     const res = await api.delete(`/subscription/admin/tiers/${id}`);
//     return res.data;
//   },

//   // ─── Subscription Prices ───────────────────────────────────────────────────
//   // UPDATED PATHS to match /subscription/admin/...
//   createSubscriptionPrice: async (payload) => {
//     const res = await api.post("/subscription/admin/prices", payload);
//     return res.data;
//   },

//   updateSubscriptionPrice: async (id, payload) => {
//     const res = await api.patch(`/subscription/admin/prices/${id}`, payload);
//     return res.data;
//   },

//   deactivateSubscriptionPrice: async (id) => {
//     const res = await api.delete(`/subscription/admin/prices/${id}`);
//     return res.data;
//   },

//   syncStripePrices: async () => {
//     const res = await api.post("/subscription/admin/sync-stripe");
//     return res.data;
//   },

//   // ─── Payouts (NEW) ────────────────────────────────────────────────────────
//   getGymPayoutSummary: async (gymId) => {
//     const res = await api.get(`/subscription/payout/gym/${gymId}/summary`);
//     return res.data;
//   },

//   getUnpaidCheckIns: async (gymId) => {
//     const res = await api.get(`/subscription/payout/gym/${gymId}/unpaid`);
//     return res.data;
//   },

//   getPayoutHistory: async (gymId) => {
//     const res = await api.get(`/subscription/payout/gym/${gymId}/history`);
//     return res.data;
//   },

//   processPayout: async (gymId, data) => {
//     const res = await api.post(
//       `/subscription/payout/gym/${gymId}/process`,
//       data,
//     );
//     return res.data;
//   },

//   updatePayoutRate: async (gymId, data) => {
//     const res = await api.patch(`/subscription/payout/gym/${gymId}/rate`, data);
//     return res.data;
//   },

//   getAllGymsPayoutOverview: async () => {
//     const res = await api.get("/subscription/payout/admin/overview");
//     return res.data;
//   },

//   getPayoutAuditLogs: async (gymId) => {
//     const res = await api.get(
//       `/subscription/payout/admin/audit-logs?gymId=${gymId || ""}`,
//     );
//     return res.data;
//   },

//   // ─── Gym Management ────────────────────────────────────────────────────────
//   deleteGym: async (gymId) => {
//     const response = await api.delete(`/admin/gyms/${gymId}`);
//     return response.data;
//   },

//   updateGymTier: async (gymId, data) => {
//     const response = await api.patch(`/admin/gyms/${gymId}/tier`, data);
//     return response.data;
//   },

//   getOwnerGyms: async () => {
//     const res = await api.get("/owner/gyms"); // Adjust to your actual endpoint
//     return res.data;
//   },

//   getOwnerGymStats: async (gymId) => {
//     const res = await api.get(`/owner/gyms/${gymId}/stats`);
//     return res.data;
//   },

//   // Payout methods (already added earlier, but confirming for owner)
//   getGymPayoutSummary: async (gymId) => {
//     const res = await api.get(`/subscription/payout/gym/${gymId}/summary`);
//     return res.data;
//   },

//   getPayoutHistory: async (gymId) => {
//     const res = await api.get(`/subscription/payout/gym/${gymId}/history`);
//     return res.data;
//   },
// };
import api from "./api";

export const adminService = {
  // ─── Dashboard Analytics ───────────────────────────────────────────────────
  /**
   * Expects backend to return:
   * {
   *   success: true,
   *   analytics: {
   *     gyms:          { total, approved, pending, rejected },
   *     users:         { total, members, owners },
   *     subscriptions: { active, breakdown?: [{name, value}] },
   *     revenue:       {
   *                      totalPkr,
   *                      monthlyGrowth,
   *                      platformEarnings   // ← ADD THIS: SUM of platformAmount on paid check-ins
   *                    },
   *     checkins:      { total, today },
   *   }
   * }
   *
   * To expose platformEarnings, add to your analytics controller:
   *   const { _sum: { platformAmount } } = await prisma.checkIn.aggregate({
   *     where: { isPaidToGym: true },
   *     _sum: { platformAmount: true }
   *   });
   * and return it as analytics.revenue.platformEarnings
   */
  getAnalytics: async () => {
    const response = await api.get("/admin/analytics");
    return response.data;
  },

  // ─── Gyms ──────────────────────────────────────────────────────────────────
  getAllGyms: async ({ status, city, search, page = 1, limit = 10 } = {}) => {
    const params = {};
    if (status) params.status = status;
    if (city) params.city = city;
    if (search) params.search = search;
    params.page = page;
    params.limit = limit;
    const response = await api.get("/admin/gyms", { params });
    return response.data;
  },

  approveGym: async (gymId, approvalNotes = "") => {
    const response = await api.patch(`/admin/gyms/${gymId}/approve`, {
      approvalNotes,
    });
    return response.data;
  },

  rejectGym: async (gymId, rejectionReason) => {
    const response = await api.patch(`/admin/gyms/${gymId}/reject`, {
      rejectionReason,
    });
    return response.data;
  },

  archiveGym: async (gymId) => {
    const response = await api.delete(`/admin/gyms/${gymId}`);
    return response.data;
  },

  // ─── Users ─────────────────────────────────────────────────────────────────
  getAllUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  suspendUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/deactivate`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  registerOwner: async ({ name, email, password }) => {
    const response = await api.post("/admin/owners/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  // ─── Check-ins ─────────────────────────────────────────────────────────────
  getCheckins: async (date = "") => {
    const params = date ? { date } : {};
    const response = await api.get("/admin/checkins", { params });
    return response.data;
  },

  // ─── QR ────────────────────────────────────────────────────────────────────
  generateQr: async (gymId) => {
    const response = await api.post("/admin/generate-qr", { gymId });
    return response.data;
  },

  reviewGym: async (gymId, payload) => {
    const response = await api.patch(`/gyms/${gymId}/review`, payload);
    return response.data;
  },

  // ─── Subscription Tiers ────────────────────────────────────────────────────
  listSubscriptionTiers: async () => {
    const res = await api.get("/subscription/admin/tiers");
    return res.data;
  },

  getSubscriptionTier: async (id) => {
    const res = await api.get(`/subscription/admin/tiers/${id}`);
    return res.data;
  },

  createSubscriptionTier: async (payload) => {
    const res = await api.post("/subscription/admin/tiers", payload);
    return res.data;
  },

  updateSubscriptionTier: async (id, payload) => {
    const res = await api.patch(`/subscription/admin/tiers/${id}`, payload);
    return res.data;
  },

  deactivateSubscriptionTier: async (id) => {
    const res = await api.delete(`/subscription/admin/tiers/${id}`);
    return res.data;
  },

  // ─── Subscription Prices ───────────────────────────────────────────────────
  createSubscriptionPrice: async (payload) => {
    const res = await api.post("/subscription/admin/prices", payload);
    return res.data;
  },

  updateSubscriptionPrice: async (id, payload) => {
    const res = await api.patch(`/subscription/admin/prices/${id}`, payload);
    return res.data;
  },

  deactivateSubscriptionPrice: async (id) => {
    const res = await api.delete(`/subscription/admin/prices/${id}`);
    return res.data;
  },

  syncStripePrices: async () => {
    const res = await api.post("/subscription/admin/sync-stripe");
    return res.data;
  },

  // ─── Payouts ───────────────────────────────────────────────────────────────
  getGymPayoutSummary: async (gymId) => {
    const res = await api.get(`/payout/gym/${gymId}/summary`);
    return res.data;
  },

  getUnpaidCheckIns: async (gymId) => {
    const res = await api.get(`/payout/gym/${gymId}/unpaid`);
    return res.data;
  },

  getPayoutHistory: async (gymId) => {
    const res = await api.get(`/payout/gym/${gymId}/history`);
    return res.data;
  },

  processPayout: async (gymId, data) => {
    const res = await api.post(`/payout/gym/${gymId}/process`, data);
    return res.data;
  },

  updatePayoutRate: async (data) => {
    // PUT /payout/admin/rates — upserts a (memberTierSlug × gymTier) row
    const res = await api.put("/payout/admin/rates", data);
    return res.data;
  },

  getAllGymsPayoutOverview: async () => {
    const res = await api.get("/payout/admin/overview");
    return res.data;
  },

  getPayoutAuditLogs: async (gymId) => {
    const params = gymId ? `?gymId=${gymId}` : "";
    const res = await api.get(`/payout/admin/audit-logs${params}`);
    return res.data;
  },

  // ─── NEW: Payout Rate Matrix ───────────────────────────────────────────────
  /**
   * GET /payout/admin/rates
   * Returns: { success, count, rates: [{ id, memberTierSlug, gymTier, gymGets, platformKeeps, multiplier, isActive }] }
   */
  getPayoutRates: async () => {
    const res = await api.get("/payout/admin/rates");
    return res.data;
  },

  // ─── Gym Management ────────────────────────────────────────────────────────
  deleteGym: async (gymId) => {
    const response = await api.delete(`/admin/gyms/${gymId}`);
    return response.data;
  },

  updateGymTier: async (gymId, data) => {
    const response = await api.patch(`/admin/gyms/${gymId}/tier`, data);
    return response.data;
  },

  getOwnerGyms: async () => {
    const res = await api.get("/owner/gyms");
    return res.data;
  },

  getOwnerGymStats: async (gymId) => {
    const res = await api.get(`/owner/gyms/${gymId}/stats`);
    return res.data;
  },
};

// import api from "./api";

// export const gymService = {
//   // ═══════════════════════════════════════════════════════════════════════════
//   // OWNER GYM MANAGEMENT
//   // ═══════════════════════════════════════════════════════════════════════════

//   getMyGyms: async () => {
//     const response = await api.get("/owners/my-gyms");
//     return response.data;
//   },

//   registerGym: async (formData) => {
//     const response = await api.post("/gyms/register", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data;
//   },

//   updateGym: async (gymId, formData) => {
//     const response = await api.patch(`/gyms/${gymId}`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data;
//   },

//   resubmitGym: async (gymId, formData) => {
//     const response = await api.patch(`/gyms/${gymId}/resubmit`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data;
//   },

//   getGym: async (gymId) => {
//     const response = await api.get(`/gyms/${gymId}`);
//     return response.data;
//   },

//   // ═══════════════════════════════════════════════════════════════════════════
//   // OWNER PAYOUT METHODS
//   // ═══════════════════════════════════════════════════════════════════════════

//   getGymPayoutSummary: async (gymId) => {
//     const response = await api.get(`/payout/gym/${gymId}/summary`);
//     return response.data;
//   },

//   getUnpaidCheckIns: async (gymId) => {
//     const response = await api.get(`/payout/gym/${gymId}/unpaid`);
//     return response.data;
//   },

//   getPayoutHistory: async (gymId) => {
//     const response = await api.get(`/payout/gym/${gymId}/history`);
//     return response.data;
//   },

//   // ─── NEW: Payout Account Management ────────────────────────────────────────
//   getPayoutAccount: async (gymId) => {
//     const response = await api.get(`/payout/gym/${gymId}/account`);
//     return response.data;
//   },

//   updatePayoutAccount: async (gymId, data) => {
//     const response = await api.put(`/payout/gym/${gymId}/account`, data);
//     return response.data;
//   },

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ADMIN METHODS
//   // ═══════════════════════════════════════════════════════════════════════════

//   reviewGym: async (gymId, payload) => {
//     const response = await api.patch(`/gyms/${gymId}/review`, payload);
//     return response.data;
//   },

//   assignTier: async (gymId, tier, approvalNotes = "") => {
//     const response = await api.patch(`/gyms/${gymId}/assign-tier`, {
//       tier,
//       approvalNotes,
//     });
//     return response.data;
//   },

//   listAllGyms: async () => {
//     const response = await api.get("/gyms");
//     return response.data;
//   },
// };

import api from "./api";

export const gymService = {
  // ═══════════════════════════════════════════════════════════════════════════
  // OWNER GYM MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  getMyGyms: async () => {
    const response = await api.get("/owners/my-gyms");
    return response.data;
  },

  registerGym: async (formData) => {
    const response = await api.post("/gyms/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateGym: async (gymId, formData) => {
    const response = await api.patch(`/gyms/${gymId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  resubmitGym: async (gymId, formData) => {
    const response = await api.patch(`/gyms/${gymId}/resubmit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getGym: async (gymId) => {
    const response = await api.get(`/gyms/${gymId}`);
    return response.data;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OWNER PAYOUT METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  getGymPayoutSummary: async (gymId) => {
    const response = await api.get(`/payout/gym/${gymId}/summary`);
    return response.data;
  },

  getUnpaidCheckIns: async (gymId) => {
    const response = await api.get(`/payout/gym/${gymId}/unpaid`);
    return response.data;
  },

  getPayoutHistory: async (gymId) => {
    const response = await api.get(`/payout/gym/${gymId}/history`);
    return response.data;
  },

  // ─── Payout Account Management ───────────────────────────────────────────
  getPayoutAccount: async (gymId) => {
    const response = await api.get(`/payout/gym/${gymId}/account`);
    return response.data;
  },

  updatePayoutAccount: async (gymId, data) => {
    const response = await api.put(`/payout/gym/${gymId}/account`, data);
    return response.data;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  reviewGym: async (gymId, payload) => {
    const response = await api.patch(`/gyms/${gymId}/review`, payload);
    return response.data;
  },

  assignTier: async (gymId, tier, approvalNotes = "") => {
    const response = await api.patch(`/gyms/${gymId}/assign-tier`, {
      tier,
      approvalNotes,
    });
    return response.data;
  },

  listAllGyms: async () => {
    const response = await api.get("/gyms");
    return response.data;
  },

  // ─── Admin Payout Methods ─────────────────────────────────────────────────
  processPayout: async (gymId, payload) => {
    const response = await api.post(`/payout/gym/${gymId}/process`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getAllGymsPayoutOverview: async () => {
    const response = await api.get("/payout/admin/overview");
    return response.data;
  },

  getPayoutRates: async () => {
    const response = await api.get("/payout/admin/rates");
    return response.data;
  },

  updatePayoutRate: async (data) => {
    const response = await api.put("/payout/admin/rates", data);
    return response.data;
  },

  getPayoutAuditLogs: async (gymId = null) => {
    const url = gymId
      ? `/payout/admin/audit-logs?gymId=${gymId}`
      : "/payout/admin/audit-logs";
    const response = await api.get(url);
    return response.data;
  },

  verifyPayoutAccount: async (gymId) => {
    const response = await api.patch(`/payout/gym/${gymId}/account/verify`);
    return response.data;
  },

  verifyPayoutAccount: async (gymId) => {
    const response = await api.patch(`/payout/gym/${gymId}/account/verify`);
    return response.data;
  },
};

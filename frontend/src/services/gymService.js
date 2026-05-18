

import api from "./api";

export const gymService = {
  // ─── Get all gyms owned by logged-in owner ─────────────────────────────────
  getMyGyms: async () => {
    const response = await api.get("/owners/my-gyms");
    return response.data; // { success, gyms: [...] }
  },

  // ─── Register a new gym (multipart — images + docs) ────────────────────────
  registerGym: async (formData) => {
    const response = await api.post("/gyms/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // { success, gym }
  },

  // ─── Update an approved gym (PATCH /:id) ───────────────────────────────────
  updateGym: async (gymId, formData) => {
    const response = await api.patch(`/gyms/${gymId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // { success, gym }
  },

  // ─── Resubmit after rejection / changes_requested (PATCH /:id/resubmit) ───
  // NOW SUPPORTS FILE UPLOADS — send FormData instead of plain object
  resubmitGym: async (gymId, formData) => {
    const response = await api.patch(`/gyms/${gymId}/resubmit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // { success, gym }
  },

  // ─── Get single gym by id ──────────────────────────────────────────────────
  getGym: async (gymId) => {
    const response = await api.get(`/gyms/${gymId}`);
    return response.data; // { success, gym }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Admin review gym — approve/reject/changes_requested + assign tier ─────
  reviewGym: async (gymId, payload) => {
    // payload: { status, tier?, rejectionReason?, approvalNotes? }
    const response = await api.patch(`/gyms/${gymId}/review`, payload);
    return response.data; // { success, gym }
  },

  // ─── Admin assign/update tier standalone ────────────────────────────────────
  assignTier: async (gymId, tier, approvalNotes = "") => {
    const response = await api.patch(`/gyms/${gymId}/assign-tier`, {
      tier,
      approvalNotes,
    });
    return response.data; // { success, gym }
  },

  // ─── Admin list all gyms (includes pending/rejected) ───────────────────────
  listAllGyms: async () => {
    const response = await api.get("/gyms");
    return response.data; // { success, gyms }
  },
};

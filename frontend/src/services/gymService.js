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
  resubmitGym: async (gymId, fields) => {
    // fields is a plain object — no files in resubmit
    const response = await api.patch(`/gyms/${gymId}/resubmit`, fields);
    return response.data; // { success, gym }
  },

  // ─── Get single gym by id ──────────────────────────────────────────────────
  getGym: async (gymId) => {
    const response = await api.get(`/gyms/${gymId}`);
    return response.data; // { success, gym }
  },
};

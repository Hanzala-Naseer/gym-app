// import api from './api';

// export const adminService = {
//   getStats: async () => {
//     // const response = await api.get('/admin/stats');
//     // return response.data;
//     return { success: true };
//   },

//   getPendingGyms: async () => {
//     // const response = await api.get('/admin/gyms/pending');
//     // return response.data;
//     return { success: true };
//   },

//   getAllGyms: async () => {
//     // const response = await api.get('/admin/gyms');
//     // return response.data;
//     return { success: true };
//   },

//   approveGym: async (gymId) => {
//     // const response = await api.post(`/admin/gym/${gymId}/approve`);
//     // return response.data;
//     return { success: true };
//   },

//   rejectGym: async (gymId) => {
//     // const response = await api.post(`/admin/gym/${gymId}/reject`);
//     // return response.data;
//     return { success: true };
//   },

//   getAllMembers: async () => {
//     // const response = await api.get('/admin/members');
//     // return response.data;
//     return { success: true };
//   },

//   getCheckins: async (date) => {
//     // const response = await api.get('/admin/checkins', { params: { date } });
//     // return response.data;
//     return { success: true };
//   },
// };

import api from "./api";

export const adminService = {
  // ─── Dashboard Analytics ───────────────────────────────────────────────────
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
};

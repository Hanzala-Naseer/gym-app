import api from './api';

export const adminService = {
  getStats: async () => {
    // const response = await api.get('/admin/stats');
    // return response.data;
    return { success: true };
  },

  getPendingGyms: async () => {
    // const response = await api.get('/admin/gyms/pending');
    // return response.data;
    return { success: true };
  },

  getAllGyms: async () => {
    // const response = await api.get('/admin/gyms');
    // return response.data;
    return { success: true };
  },

  approveGym: async (gymId) => {
    // const response = await api.post(`/admin/gym/${gymId}/approve`);
    // return response.data;
    return { success: true };
  },

  rejectGym: async (gymId) => {
    // const response = await api.post(`/admin/gym/${gymId}/reject`);
    // return response.data;
    return { success: true };
  },

  getAllMembers: async () => {
    // const response = await api.get('/admin/members');
    // return response.data;
    return { success: true };
  },

  getCheckins: async (date) => {
    // const response = await api.get('/admin/checkins', { params: { date } });
    // return response.data;
    return { success: true };
  },
};

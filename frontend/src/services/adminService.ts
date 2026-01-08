import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getPendingGyms: async () => {
    const response = await api.get('/admin/gyms/pending');
    return response.data;
  },

  getAllGyms: async () => {
    const response = await api.get('/admin/gyms');
    return response.data;
  },

  approveGym: async (gymId: string) => {
    const response = await api.post(`/admin/gym/${gymId}/approve`);
    return response.data;
  },

  rejectGym: async (gymId: string) => {
    const response = await api.post(`/admin/gym/${gymId}/reject`);
    return response.data;
  },

  getAllMembers: async () => {
    const response = await api.get('/admin/members');
    return response.data;
  },

  getCheckins: async (date?: string) => {
    const response = await api.get('/admin/checkins', { params: { date } });
    return response.data;
  },
};

import api from './api';

export const gymService = {
  registerGym: async (gymData) => {
    // const response = await api.post('/owner/gym/register', gymData);
    // return response.data;
    return { success: true };
  },

  getMyGym: async () => {
    // const response = await api.get('/owner/gym');
    // return response.data;
    return { success: true };
  },

  getMembers: async () => {
    // const response = await api.get('/owner/members');
    // return response.data;
    return { success: true };
  },

  getCheckins: async (date) => {
    // const response = await api.get('/owner/checkins', { params: { date } });
    // return response.data;
    return { success: true };
  },

  getTodayCheckins: async () => {
    // const response = await api.get('/owner/checkins/today');
    // return response.data;
    return { success: true };
  },
};

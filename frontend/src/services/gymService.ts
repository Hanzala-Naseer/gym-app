import api from './api';

export interface GymData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  planType: string;
  imageUrl?: string;
  facilities: string[];
  hours: Record<string, string>;
}

export const gymService = {
  registerGym: async (gymData: GymData) => {
    const response = await api.post('/owner/gym/register', gymData);
    return response.data;
  },

  getMyGym: async () => {
    const response = await api.get('/owner/gym');
    return response.data;
  },

  getMembers: async () => {
    const response = await api.get('/owner/members');
    return response.data;
  },

  getCheckins: async (date?: string) => {
    const response = await api.get('/owner/checkins', { params: { date } });
    return response.data;
  },

  getTodayCheckins: async () => {
    const response = await api.get('/owner/checkins/today');
    return response.data;
  },
};

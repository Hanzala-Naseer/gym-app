import api from './api';

export const authService = {
  register: async (fullName: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { fullName, email, password });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  resendOtp: async (email: string) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },
};

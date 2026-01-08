import api from './api';

export const authService = {
  register: async (fullName, email, password) => {
    // const response = await api.post('/auth/register', { fullName, email, password });
    // return response.data;
    return { success: true };
  },

  verifyOtp: async (email, otp) => {
    // const response = await api.post('/auth/verify-otp', { email, otp });
    // return response.data;
    return { success: true };
  },

  login: async (email, password) => {
    // const response = await api.post('/auth/login', { email, password });
    // return response.data;
    return { success: true };
  },

  resendOtp: async (email) => {
    // const response = await api.post('/auth/resend-otp', { email });
    // return response.data;
    return { success: true };
  },
};

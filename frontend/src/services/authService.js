// import api from './api';

// export const authService = {
//   register: async (fullName, email, password) => {
//     // const response = await api.post('/auth/register', { fullName, email, password });
//     // return response.data;
//     return { success: true };
//   },

//   verifyOtp: async (email, otp) => {
//     // const response = await api.post('/auth/verify-otp', { email, otp });
//     // return response.data;
//     return { success: true };
//   },

//   login: async (email, password) => {
//     // const response = await api.post('/auth/login', { email, password });
//     // return response.data;
//     return { success: true };
//   },

//   resendOtp: async (email) => {
//     // const response = await api.post('/auth/resend-otp', { email });
//     // return response.data;
//     return { success: true };
//   },
// };

import api from "./api";

export const authService = {
  // ───────────────── REGISTER ─────────────────
  register: async (name, email, password) => {
    try {
      const response = await api.post("/owners/register", {
        name,
        email,
        password,
      });

      return response.data;
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error.message);

      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed",
      );
    }
  },

  // ───────────────── VERIFY OTP ─────────────────
  verifyOtp: async (email, otp) => {
    try {
      const response = await api.post("/owners/verify-otp", {
        email,
        otp,
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "OTP verification failed",
      );
    }
  },

  // ───────────────── LOGIN ─────────────────
  login: async (email, password) => {
    try {
      const response = await api.post("/owners/login", {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  // ───────────────── RESEND OTP ─────────────────
  resendOtp: async (email) => {
    try {
      const response = await api.post("/auth/resend-otp", {
        email,
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to resend OTP");
    }
  },
};

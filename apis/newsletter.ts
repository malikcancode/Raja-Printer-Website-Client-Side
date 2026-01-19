import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const newsletterAPI = {
  subscribe: async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/newsletter/subscribe`, {
        email,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to subscribe",
      };
    }
  },

  unsubscribe: async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/newsletter/unsubscribe`, {
        email,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to unsubscribe",
      };
    }
  },

  getAllSubscribers: async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/newsletter/subscribers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch subscribers",
      };
    }
  },
};

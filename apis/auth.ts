import axios from "axios";

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Ensure /api suffix is present
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
  }
  return "http://localhost:5000/api";
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem("auth_token");
      localStorage.removeItem("raja_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    token: string;
  };
}

export const authAPI = {
  // Login
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials,
    );
    return response.data;
  },

  // Get current user
  getMe: async (): Promise<AuthResponse> => {
    const response = await apiClient.get<AuthResponse>("/auth/me");
    return response.data;
  },

  // Update password
  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.put("/auth/updatepassword", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export default apiClient;

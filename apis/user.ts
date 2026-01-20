import apiClient from "./auth";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: string;
  profilePicture?: string;
}

export interface GetAllUsersResponse {
  success: boolean;
  count: number;
  data: User[];
}

export interface ToggleUserStatusResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface UpdateProfileData {
  name: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    profilePicture: string;
    isAdmin: boolean;
  };
}

export const userAPI = {
  // Get all users (Admin only)
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<GetAllUsersResponse>("/auth/users");
    return response.data.data;
  },

  // Toggle user active status (Admin only)
  toggleUserStatus: async (userId: string): Promise<User> => {
    const response = await apiClient.put<ToggleUserStatusResponse>(
      `/auth/users/${userId}/toggle-status`,
    );
    return response.data.data;
  },

  // Delete user (Admin only)
  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete<DeleteUserResponse>(`/auth/users/${userId}`);
  },

  // Update profile (name and password)
  updateProfile: async (
    data: UpdateProfileData,
  ): Promise<UpdateProfileResponse> => {
    const response = await apiClient.put<UpdateProfileResponse>(
      "/auth/profile",
      data,
    );
    return response.data;
  },
};

// Export individual functions for backwards compatibility
export const getAllUsers = userAPI.getAllUsers;
export const toggleUserStatus = userAPI.toggleUserStatus;
export const deleteUser = userAPI.deleteUser;

import apiClient from "./auth";

// Get user notifications
export const getUserNotifications = async (limit = 20, unreadOnly = false) => {
  try {
    const response = await apiClient.get("/notifications", {
      params: { limit, unreadOnly },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch notifications",
    );
  }
};

// Get unread count
export const getUnreadCount = async () => {
  try {
    const response = await apiClient.get("/notifications/unread-count");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to get unread count",
    );
  }
};

// Mark notification as read
export const markAsRead = async (notificationId: string) => {
  try {
    const response = await apiClient.put(
      `/notifications/${notificationId}/read`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to mark notification as read",
    );
  }
};

// Mark all as read
export const markAllAsRead = async () => {
  try {
    const response = await apiClient.put("/notifications/read-all");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to mark all as read",
    );
  }
};

// Delete notification
export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete notification",
    );
  }
};

// Clear read notifications
export const clearReadNotifications = async () => {
  try {
    const response = await apiClient.delete("/notifications/clear-read");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to clear read notifications",
    );
  }
};

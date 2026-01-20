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

const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

// Calculate shipping for order
export const calculateShipping = async (
  items: { productId: string; quantity: number }[],
  city: string,
  country: string = "Pakistan",
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/shipping/calculate`, {
      items,
      city,
      country,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to calculate shipping",
    );
  }
};

// Check if delivery is available
export const checkDeliveryAvailability = async (
  city: string,
  country: string = "Pakistan",
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/shipping/check-availability`,
      {
        params: { city, country },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to check availability",
    );
  }
};

// Admin: Get all shipping zones
export const getAllShippingZones = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/shipping/zones`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch shipping zones",
    );
  }
};

// Admin: Get single zone
export const getShippingZone = async (id: string) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/shipping/zones/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch shipping zone",
    );
  }
};

// Admin: Create shipping zone
export const createShippingZone = async (zoneData: any) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_BASE_URL}/shipping/zones`,
      zoneData,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create shipping zone",
    );
  }
};

// Admin: Update shipping zone
export const updateShippingZone = async (id: string, zoneData: any) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `${API_BASE_URL}/shipping/zones/${id}`,
      zoneData,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update shipping zone",
    );
  }
};

// Admin: Toggle zone status
export const toggleShippingZoneStatus = async (
  id: string,
  force: boolean = false,
) => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(
      `${API_BASE_URL}/shipping/zones/${id}/toggle`,
      { force },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to toggle zone status",
    );
  }
};

// Admin: Delete shipping zone
export const deleteShippingZone = async (id: string) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(
      `${API_BASE_URL}/shipping/zones/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete shipping zone",
    );
  }
};

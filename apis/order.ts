import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

interface CartItem {
  productId: string;
  quantity: number;
}

interface ShippingAddress {
  country: string;
  city: string;
  zipCode: string;
  addressLine1: string;
  addressLine2?: string;
  state?: string;
}

interface OrderData {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod?: string;
  orderNotes?: string;
}

// Calculate shipping cost
export const calculateShipping = async (
  items: CartItem[],
  destinationCountry: string,
) => {
  try {
    const response = await axios.post(`${API_URL}/calculate-shipping`, {
      items,
      destinationCountry,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to calculate shipping",
    );
  }
};

// Create new order
export const createOrder = async (orderData: OrderData) => {
  try {
    const token = localStorage.getItem("auth_token");
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    const response = await axios.post(API_URL, orderData, config);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create order");
  }
};

// Get user orders (authenticated)
export const getUserOrders = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.get(`${API_URL}/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user orders",
    );
  }
};

// Get single order by ID (with optional email for guest)
export const getOrder = async (orderId: string, email?: string) => {
  try {
    const token = localStorage.getItem("auth_token");
    const config: any = {};

    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    if (email) {
      config.params = { email };
    }

    const response = await axios.get(`${API_URL}/${orderId}`, config);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch order");
  }
};

// Admin: Get all orders
export const getAllOrders = async (status?: string, page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const params: any = { page, limit };
    if (status) {
      params.status = status;
    }

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};

// Admin: Update order status
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.put(
      `${API_URL}/${orderId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update order status",
    );
  }
};

// Admin: Delete order
export const deleteOrder = async (orderId: string) => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.delete(`${API_URL}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete order");
  }
};

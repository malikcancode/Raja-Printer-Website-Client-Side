import apiClient from "./auth";

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
    const response = await apiClient.post("/orders/calculate-shipping", {
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
    const response = await apiClient.post("/orders", orderData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create order");
  }
};

// Get user orders (authenticated)
export const getUserOrders = async () => {
  try {
    const response = await apiClient.get("/orders/my-orders");
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
    const config: any = {};
    if (email) {
      config.params = { email };
    }

    const response = await apiClient.get(`/orders/${orderId}`, config);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch order");
  }
};

// Admin: Get all orders
export const getAllOrders = async (status?: string, page = 1, limit = 10) => {
  try {
    const params: any = { page, limit };
    if (status) {
      params.status = status;
    }

    const response = await apiClient.get("/orders", { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};

// Admin: Update order status
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await apiClient.put(`/orders/${orderId}/status`, {
      status,
    });
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
    const response = await apiClient.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete order");
  }
};

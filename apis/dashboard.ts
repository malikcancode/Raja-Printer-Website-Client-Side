import apiClient from "./auth";

export interface DashboardStats {
  totals: {
    revenue: number;
    orders: number;
    products: number;
    users: number;
  };
  today: {
    orders: number;
    revenue: number;
  };
  thisMonth: {
    orders: number;
    revenue: number;
    revenueGrowth: number;
  };
  orderStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  inventory: {
    lowStockProducts: Array<{
      _id: string;
      name: string;
      stock: number;
      image: string;
      category: string;
      price: number;
    }>;
    outOfStockCount: number;
    lowStockCount: number;
  };
  averageOrderValue: number;
}

export interface ChartDataPoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  _id: string;
  name: string;
  image: string;
  totalSold: number;
  totalRevenue: number;
}

export interface RecentOrder {
  _id: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: Array<{ name: string; quantity: number }>;
}

export interface CategorySales {
  category: string;
  totalSold: number;
  totalRevenue: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const dashboardAPI = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await apiClient.get("/dashboard/stats");
    return response.data;
  },

  getRevenueChart: async (
    period: "weekly" | "monthly" = "weekly",
  ): Promise<ApiResponse<ChartDataPoint[]>> => {
    const response = await apiClient.get(
      `/dashboard/revenue-chart?period=${period}`,
    );
    return response.data;
  },

  getTopProducts: async (
    limit: number = 5,
  ): Promise<ApiResponse<TopProduct[]>> => {
    const response = await apiClient.get(
      `/dashboard/top-products?limit=${limit}`,
    );
    return response.data;
  },

  getRecentOrders: async (
    limit: number = 5,
  ): Promise<ApiResponse<RecentOrder[]>> => {
    const response = await apiClient.get(
      `/dashboard/recent-orders?limit=${limit}`,
    );
    return response.data;
  },

  getSalesByCategory: async (): Promise<ApiResponse<CategorySales[]>> => {
    const response = await apiClient.get("/dashboard/sales-by-category");
    return response.data;
  },
};

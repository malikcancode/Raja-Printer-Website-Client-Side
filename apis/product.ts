import apiClient from "./auth";

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  cloudinaryId?: string;
  rating?: number;
  tags?: string[];
  isHot?: boolean;
  isSale?: boolean;
  discount?: string;
  stock?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductsResponse {
  success: boolean;
  count?: number;
  data: Product[] | Product;
  message?: string;
}

export const productAPI = {
  // Get all products
  getAll: async (params?: {
    category?: string;
    search?: string;
    sort?: string;
  }): Promise<ProductsResponse> => {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    const response = await apiClient.get<ProductsResponse>(
      `/products${queryString ? `?${queryString}` : ""}`,
    );
    return response.data;
  },

  // Get single product
  getById: async (id: string): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(`/products/${id}`);
    return response.data;
  },

  // Create product
  create: async (productData: FormData): Promise<ProductsResponse> => {
    const response = await apiClient.post<ProductsResponse>(
      "/products",
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  // Create product with URL (no file upload)
  createWithUrl: async (
    productData: Partial<Product>,
  ): Promise<ProductsResponse> => {
    const response = await apiClient.post<ProductsResponse>(
      "/products",
      productData,
    );
    return response.data;
  },

  // Update product
  update: async (
    id: string,
    productData: FormData,
  ): Promise<ProductsResponse> => {
    const response = await apiClient.put<ProductsResponse>(
      `/products/${id}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  // Update product with URL (no file upload)
  updateWithUrl: async (
    id: string,
    productData: Partial<Product>,
  ): Promise<ProductsResponse> => {
    const response = await apiClient.put<ProductsResponse>(
      `/products/${id}`,
      productData,
    );
    return response.data;
  },

  // Delete product
  delete: async (id: string): Promise<ProductsResponse> => {
    const response = await apiClient.delete<ProductsResponse>(
      `/products/${id}`,
    );
    return response.data;
  },
};

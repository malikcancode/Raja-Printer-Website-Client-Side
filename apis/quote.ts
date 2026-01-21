import apiClient from "./auth";

export interface QuoteData {
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  requirement: string;
  message?: string;
}

// Submit quote request
export const submitQuoteRequest = async (data: QuoteData) => {
  try {
    const response = await apiClient.post("/quote", data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to submit quote request",
    );
  }
};

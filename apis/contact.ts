import apiClient from "./auth";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
}

export const contactAPI = {
  sendMessage: async (data: ContactFormData): Promise<ContactResponse> => {
    const response = await apiClient.post("/contact", data);
    return response.data;
  },
};

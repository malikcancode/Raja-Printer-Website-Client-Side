import apiClient from "./auth";

export interface Review {
  _id: string;
  product: string;
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  userName: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Reply[];
  replyCount?: number;
}

export interface Reply {
  _id: string;
  review: string;
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  userName: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  count: number;
  averageRating: number;
  data: Review[];
}

export interface SubmitReviewData {
  rating: number;
  comment: string;
}

// Get reviews for a product
export const getProductReviews = async (
  productId: string,
): Promise<ReviewsResponse> => {
  try {
    const response = await apiClient.get(`/reviews/${productId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch reviews");
  }
};

// Submit a review for a product
export const submitReview = async (
  productId: string,
  data: SubmitReviewData,
) => {
  try {
    const response = await apiClient.post(`/reviews/${productId}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to submit review");
  }
};

// Get user's review for a product
export const getUserReview = async (productId: string) => {
  try {
    const response = await apiClient.get(`/reviews/${productId}/my-review`);
    return response.data;
  } catch (error: any) {
    // Return null if no review found (404)
    if (error.response?.status === 404) {
      return { success: false, data: null };
    }
    throw new Error(
      error.response?.data?.message || "Failed to fetch user review",
    );
  }
};

// Update a review
export const updateReview = async (
  reviewId: string,
  data: SubmitReviewData,
) => {
  try {
    const response = await apiClient.put(`/reviews/${reviewId}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update review");
  }
};

// Delete a review
export const deleteReview = async (reviewId: string) => {
  try {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete review");
  }
};

// Get replies for a review
export const getReviewReplies = async (reviewId: string) => {
  try {
    const response = await apiClient.get(`/replies/${reviewId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch replies");
  }
};

// Add a reply to a review
export const addReply = async (reviewId: string, comment: string) => {
  try {
    const response = await apiClient.post(`/replies/${reviewId}`, { comment });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add reply");
  }
};

// Update a reply
export const updateReplyAPI = async (replyId: string, comment: string) => {
  try {
    const response = await apiClient.put(`/replies/reply/${replyId}`, {
      comment,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update reply");
  }
};

// Delete a reply
export const deleteReplyAPI = async (replyId: string) => {
  try {
    const response = await apiClient.delete(`/replies/reply/${replyId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete reply");
  }
};

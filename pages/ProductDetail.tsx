import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { productAPI, Product as APIProduct } from "../apis/product";
import {
  getProductReviews,
  submitReview,
  getUserReview,
  updateReview,
  Review,
  Reply,
  getReviewReplies,
  addReply,
} from "../apis/review";
import {
  ShoppingCart,
  Check,
  Star,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  Share2,
  Copy,
  User,
  AlertCircle,
  MessageCircle,
  Send,
} from "lucide-react";
import { Product } from "../types";

const RelatedProductItem: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useShop();
  const [isAdding, setIsAdding] = useState(false);
  const productId = (product as any)._id || product.id;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <Link to={`/product/${productId}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {product.isSale && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Sale
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">
          {product.category}
        </span>
        <Link
          to={`/product/${productId}`}
          className="text-sm font-bold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2"
          title={product.name}
        >
          {product.name}
        </Link>
        <div className="mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-extrabold text-gray-900">
              PKR {product.price.toLocaleString()}
            </span>
            {product.rating > 0 && (
              <div className="flex items-center gap-0.5 text-yellow-400">
                <Star size={12} className="fill-current" />
                <span className="text-xs text-gray-400 font-medium">
                  {product.rating}
                </span>
              </div>
            )}
          </div>
          <div className="mb-3">
            <span
              className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                (product.stock || 0) === 0
                  ? "bg-red-100 text-red-700"
                  : (product.stock || 0) <= 5
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {(product.stock || 0) === 0
                ? "Out of Stock"
                : (product.stock || 0) <= 5
                  ? `Only ${product.stock} left`
                  : "In Stock"}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || (product.stock || 0) === 0}
            className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait ${
              (product.stock || 0) === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-blue-600"
            }`}
          >
            {isAdding ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <ShoppingCart size={14} />
            )}
            {(product.stock || 0) === 0
              ? "Out of Stock"
              : isAdding
                ? "Adding..."
                : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, products, user } = useShop();
  const [product, setProduct] = useState<(Product & APIProduct) | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs">(
    "description",
  );
  const [shareFeedback, setShareFeedback] = useState("Share");

  // Review State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [reviewErrors, setReviewErrors] = useState<{
    comment?: string;
  }>({});
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Reply State
  const [reviewReplies, setReviewReplies] = useState<{
    [reviewId: string]: Reply[];
  }>({});
  const [showReplies, setShowReplies] = useState<{
    [reviewId: string]: boolean;
  }>({});
  const [replyText, setReplyText] = useState<{ [reviewId: string]: string }>(
    {},
  );
  const [isSubmittingReply, setIsSubmittingReply] = useState<{
    [reviewId: string]: boolean;
  }>({});
  const [loadingReplies, setLoadingReplies] = useState<{
    [reviewId: string]: boolean;
  }>({});

  // Fetch product from API for fresh data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Try to fetch by ID (could be MongoDB _id)
        const response = await productAPI.getById(id);
        if (
          response.success &&
          response.data &&
          !Array.isArray(response.data)
        ) {
          setProduct(response.data as Product & APIProduct);
        } else {
          // Fallback to context products
          const contextProduct = products.find(
            (p) => p.id === id || (p as any)._id === id,
          );
          if (contextProduct) {
            setProduct(contextProduct as Product & APIProduct);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        // Fallback to context products
        const contextProduct = products.find(
          (p) => p.id === id || (p as any)._id === id,
        );
        if (contextProduct) {
          setProduct(contextProduct as Product & APIProduct);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, products]);

  // Fetch reviews when product changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      setReviewsLoading(true);
      try {
        const response = await getProductReviews(id);
        if (response.success) {
          setReviews(response.data);
          setAverageRating(response.averageRating);

          // Fetch replies for all reviews to show accurate counts
          const repliesData: { [reviewId: string]: Reply[] } = {};
          await Promise.all(
            response.data.map(async (review) => {
              try {
                const repliesResponse = await getReviewReplies(review._id);
                if (repliesResponse.success) {
                  repliesData[review._id] = repliesResponse.data;
                }
              } catch (error) {
                console.error(
                  `Error fetching replies for review ${review._id}:`,
                  error,
                );
              }
            }),
          );
          setReviewReplies(repliesData);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // Fetch user's review if logged in
  useEffect(() => {
    const fetchUserReview = async () => {
      if (!id || !user) return;

      try {
        const response = await getUserReview(id);
        if (response.success && response.data) {
          setUserReview(response.data);
          setReviewForm({
            rating: response.data.rating,
            comment: response.data.comment,
          });
        }
      } catch (error) {
        // User hasn't reviewed yet
        setUserReview(null);
      }
    };

    fetchUserReview();
  }, [id, user]);

  const relatedProducts = React.useMemo(() => {
    if (!product) return [];
    // Prioritize same category, then others
    const sameCategory = products.filter(
      (p) =>
        p.category === product.category &&
        p.id !== product.id &&
        (p as any)._id !== (product as any)._id,
    );
    const otherProducts = products.filter(
      (p) =>
        p.category !== product.category &&
        p.id !== product.id &&
        (p as any)._id !== (product as any)._id,
    );
    return [...sameCategory, ...otherProducts].slice(0, 4);
  }, [product, products]);

  const handleShare = async () => {
    if (!product) return;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} at Raja Business Systems`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareFeedback("Link Copied!");
        setTimeout(() => setShareFeedback("Share"), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const validateReviewForm = () => {
    const errors: { comment?: string } = {};
    let isValid = true;

    if (!reviewForm.comment.trim()) {
      errors.comment = "Review content is required";
      isValid = false;
    } else if (reviewForm.comment.trim().length < 10) {
      errors.comment = "Review must be at least 10 characters long";
      isValid = false;
    }

    setReviewErrors(errors);
    return isValid;
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewMessage(null);

    // Check if user is logged in
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    if (!validateReviewForm()) {
      return;
    }

    setIsSubmittingReview(true);

    try {
      let response;

      if (userReview && isEditingReview) {
        // Update existing review
        response = await updateReview(userReview._id, {
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        });

        if (response.success) {
          setReviewMessage({
            type: "success",
            text: "Review updated successfully!",
          });
          // Update the review in the list
          setReviews(
            reviews.map((r) =>
              r._id === response.data._id ? response.data : r,
            ),
          );
          setUserReview(response.data);
          setIsEditingReview(false);

          // Recalculate average rating
          const updatedReviews = reviews.map((r) =>
            r._id === response.data._id ? response.data : r,
          );
          const newAvg =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
            updatedReviews.length;
          setAverageRating(Math.round(newAvg * 10) / 10);

          // Clear message after 3 seconds
          setTimeout(() => setReviewMessage(null), 3000);
        }
      } else {
        // Submit new review
        response = await submitReview(id!, {
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        });

        if (response.success) {
          setReviewMessage({
            type: "success",
            text: "Review submitted successfully!",
          });
          setReviews([response.data, ...reviews]);
          setUserReview(response.data);
          setReviewErrors({});

          // Recalculate average rating
          const newAvg =
            [response.data, ...reviews].reduce((sum, r) => sum + r.rating, 0) /
            (reviews.length + 1);
          setAverageRating(Math.round(newAvg * 10) / 10);

          // Clear message after 3 seconds
          setTimeout(() => setReviewMessage(null), 3000);
        }
      }
    } catch (error: any) {
      setReviewMessage({
        type: "error",
        text: error.message || "Failed to submit review",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Reply functions
  const toggleReplies = async (reviewId: string) => {
    const newShowReplies = !showReplies[reviewId];
    setShowReplies({ ...showReplies, [reviewId]: newShowReplies });
  };

  const handleAddReply = async (reviewId: string) => {
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    const comment = replyText[reviewId]?.trim();
    if (!comment) return;

    setIsSubmittingReply({ ...isSubmittingReply, [reviewId]: true });

    try {
      const response = await addReply(reviewId, comment);
      if (response.success) {
        // Add new reply to the list
        const currentReplies = reviewReplies[reviewId] || [];
        setReviewReplies({
          ...reviewReplies,
          [reviewId]: [...currentReplies, response.data],
        });
        // Clear input
        setReplyText({ ...replyText, [reviewId]: "" });
      }
    } catch (error: any) {
      console.error("Error adding reply:", error);
    } finally {
      setIsSubmittingReply({ ...isSubmittingReply, [reviewId]: false });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product not found
        </h2>
        <Link to="/shop" className="text-blue-600 hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    // Add the product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <div className="pt-8 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Breadcrumb / Back */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to results
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:divide-x divide-gray-100">
            {/* Image Gallery Section */}
            <div className="p-8 lg:p-12 bg-gray-50 flex items-center justify-center relative group">
              <div className="relative aspect-square w-full max-w-lg bg-white rounded-xl shadow-sm overflow-hidden p-8 border border-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />
                {product.isHot && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
                    Hot
                  </span>
                )}
                {product.isSale && (
                  <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
                    {product.discount || "Sale"}
                  </span>
                )}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="mb-1">
                <span className="text-blue-600 font-bold uppercase tracking-wider text-xs bg-blue-50 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < product.rating
                          ? "fill-current"
                          : "text-gray-200 fill-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  ({reviews.length} Reviews)
                </span>
              </div>

              <div className="text-3xl font-extrabold text-gray-900 mb-4 flex items-center gap-3">
                PKR {product.price.toLocaleString()}
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 font-medium line-through">
                    PKR {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="mb-6">
                <span
                  className={`inline-flex items-center text-sm font-bold px-3 py-1.5 rounded-full ${
                    (product.stock || 0) === 0
                      ? "bg-red-100 text-red-700"
                      : (product.stock || 0) <= 5
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {(product.stock || 0) === 0
                    ? "Out of Stock"
                    : (product.stock || 0) <= 5
                      ? `Low Stock - Only ${product.stock} left`
                      : `In Stock (${product.stock} available)`}
                </span>
              </div>

              <p className="text-gray-500 mb-8 leading-relaxed">
                {(product as any).description
                  ? (product as any).description.length > 200
                    ? (product as any).description.substring(0, 200) + "..."
                    : (product as any).description
                  : `Experience professional-grade quality with the ${product.name}. Designed for efficiency and reliability, this solution fits perfectly into modern office environments, ensuring high productivity and low operational costs.`}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Quantity Selector */}
                <div
                  className={`flex items-center border border-gray-200 rounded-xl bg-gray-50 w-full sm:w-auto ${(product.stock || 0) === 0 ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock || 99, q + 1))
                    }
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || (product.stock || 0) === 0}
                  className={`flex-1 px-8 py-3 rounded-xl font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-75 ${
                    (product.stock || 0) === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                  }`}
                >
                  {isAdding ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <ShoppingCart size={20} />
                  )}
                  {(product.stock || 0) === 0
                    ? "Out of Stock"
                    : isAdding
                      ? "Adding..."
                      : `Add ${quantity > 1 ? quantity + " " : ""}to Cart`}
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group"
                >
                  <div className="p-2 bg-gray-100 rounded-full group-hover:bg-blue-100 transition-colors">
                    {shareFeedback === "Link Copied!" ? (
                      <Copy size={18} />
                    ) : (
                      <Share2 size={18} />
                    )}
                  </div>
                  {shareFeedback}
                </button>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                  <Truck size={18} className="text-blue-600" /> Free Shipping in
                  Rawalpindi
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                  <ShieldCheck size={18} className="text-blue-600" /> 1 Year
                  Official Warranty
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                  <Check size={18} className="text-blue-600" /> Genuine Product
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                  <Check size={18} className="text-blue-600" /> Lifetime Support
                </div>
              </div>

              {/* Tags */}
              {product.tags && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description Tabs */}
          <div className="border-t border-gray-100">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("description")}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest text-center transition-colors border-b-2 ${activeTab === "description" ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-900"}`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest text-center transition-colors border-b-2 ${activeTab === "specs" ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-900"}`}
              >
                Specifications
              </button>
            </div>
            <div className="p-8 lg:p-12 bg-gray-50/30">
              {activeTab === "description" ? (
                <div className="max-w-3xl mx-auto space-y-6 text-gray-600 leading-relaxed">
                  {(product as any).description ? (
                    <div className="whitespace-pre-line">
                      {(product as any).description}
                    </div>
                  ) : (
                    <>
                      <p>
                        Enhance your office productivity with the{" "}
                        <strong>{product.name}</strong>. Engineered for
                        high-volume environments, this device offers superior
                        print quality, speed, and reliability. Whether you're
                        printing documents, reports, or marketing materials, you
                        can count on crisp text and vibrant images every time.
                      </p>
                      <p>
                        With its robust construction and advanced features, it
                        is built to handle the rigorous demands of modern
                        business. It integrates seamlessly into your existing
                        network, offering secure printing and easy management
                        tools for IT administrators.
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          High-speed printing output to keep your workflow
                          moving.
                        </li>
                        <li>
                          Energy-efficient design reduces power consumption and
                          costs.
                        </li>
                        <li>User-friendly interface for easy operation.</li>
                        <li>
                          Compact footprint to save valuable office space.
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  {(product as any).specifications &&
                  (product as any).specifications.length > 0 ? (
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-gray-100">
                        {(product as any).specifications.map(
                          (
                            spec: { key: string; value: string },
                            index: number,
                          ) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="py-3 px-4 font-bold text-gray-900 w-1/3 border border-gray-100">
                                {spec.key}
                              </td>
                              <td className="py-3 px-4 text-gray-600 border border-gray-100">
                                {spec.value}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-gray-100">
                        <tr className="bg-white">
                          <td className="py-3 px-4 font-bold text-gray-900 w-1/3 border border-gray-100">
                            Print Speed
                          </td>
                          <td className="py-3 px-4 text-gray-600 border border-gray-100">
                            Up to 40 ppm
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="py-3 px-4 font-bold text-gray-900 w-1/3 border border-gray-100">
                            Resolution
                          </td>
                          <td className="py-3 px-4 text-gray-600 border border-gray-100">
                            1200 x 1200 dpi
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="py-3 px-4 font-bold text-gray-900 w-1/3 border border-gray-100">
                            Connectivity
                          </td>
                          <td className="py-3 px-4 text-gray-600 border border-gray-100">
                            USB 2.0, Gigabit Ethernet, Wi-Fi (Optional)
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="py-3 px-4 font-bold text-gray-900 w-1/3 border border-gray-100">
                            Paper Capacity
                          </td>
                          <td className="py-3 px-4 text-gray-600 border border-gray-100">
                            550 sheets (Standard), Expandable to 2300
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="py-3 px-4 font-bold text-gray-900 w-1/3 border border-gray-100">
                            Duplex Printing
                          </td>
                          <td className="py-3 px-4 text-gray-600 border border-gray-100">
                            Automatic (Standard)
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="py-3 px-4 font-bold text-gray-900 w-1/3 border border-gray-100">
                            Warranty
                          </td>
                          <td className="py-3 px-4 text-gray-600 border border-gray-100">
                            1 Year On-site
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12 mb-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
            Customer Reviews
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {reviews.length}
            </span>
            {averageRating > 0 && (
              <div className="flex items-center gap-1 ml-auto">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">/ 5</span>
              </div>
            )}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Review List */}
            <div className="lg:col-span-7 space-y-8">
              {reviewsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-gray-100 last:border-0 pb-8 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {review.user?.profilePicture ? (
                          <img
                            src={review.user.profilePicture}
                            alt={review.userName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                            <User size={20} />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">
                            {review.userName}
                          </h4>
                          <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? "fill-current"
                                : "text-gray-200 fill-gray-200"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {review.comment}
                    </p>

                    {/* Reply Button */}
                    <div className="mt-4 flex items-center gap-4">
                      <button
                        onClick={() => toggleReplies(review._id)}
                        className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <MessageCircle size={14} />
                        {reviewReplies[review._id]?.length || 0} Replies
                      </button>
                    </div>

                    {/* Replies Section */}
                    {showReplies[review._id] && (
                      <div className="mt-4 pl-8 border-l-2 border-gray-200 space-y-4">
                        {loadingReplies[review._id] ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                          </div>
                        ) : (
                          <>
                            {/* Existing Replies */}
                            {reviewReplies[review._id]?.map((reply) => (
                              <div
                                key={reply._id}
                                className="bg-gray-50 rounded-lg p-3"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  {reply.user?.profilePicture ? (
                                    <img
                                      src={reply.user.profilePicture}
                                      alt={reply.userName}
                                      className="w-6 h-6 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                                      <User size={12} />
                                    </div>
                                  )}
                                  <div>
                                    <span className="font-semibold text-gray-900 text-xs">
                                      {reply.userName}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-2">
                                      {new Date(
                                        reply.createdAt,
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-gray-700 text-xs">
                                  {reply.comment}
                                </p>
                              </div>
                            ))}

                            {/* Add Reply Input */}
                            {user && (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={replyText[review._id] || ""}
                                  onChange={(e) =>
                                    setReplyText({
                                      ...replyText,
                                      [review._id]: e.target.value,
                                    })
                                  }
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleAddReply(review._id);
                                    }
                                  }}
                                  placeholder="Write a reply..."
                                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent"
                                  disabled={isSubmittingReply[review._id]}
                                />
                                <button
                                  onClick={() => handleAddReply(review._id)}
                                  disabled={
                                    isSubmittingReply[review._id] ||
                                    !replyText[review._id]?.trim()
                                  }
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                  {isSubmittingReply[review._id] ? (
                                    <Loader2
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Send size={16} />
                                  )}
                                </button>
                              </div>
                            )}

                            {!user && (
                              <p className="text-xs text-gray-500 italic">
                                Please{" "}
                                <button
                                  onClick={() =>
                                    navigate("/login", {
                                      state: {
                                        from: window.location.pathname,
                                      },
                                    })
                                  }
                                  className="text-blue-600 hover:underline font-semibold"
                                >
                                  login
                                </button>{" "}
                                to reply
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No reviews yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Be the first to write a review!
                  </p>
                </div>
              )}
            </div>

            {/* Review Form */}
            <div className="lg:col-span-5">
              <div className="bg-gray-50 rounded-xl p-6 lg:p-8 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">
                  {userReview && !isEditingReview
                    ? "Your Review"
                    : userReview && isEditingReview
                      ? "Update Your Review"
                      : "Write a Review"}
                </h3>
                {!user && (
                  <p className="text-sm text-gray-500 mb-6">
                    Please{" "}
                    <button
                      onClick={() =>
                        navigate("/login", {
                          state: { from: window.location.pathname },
                        })
                      }
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      login
                    </button>{" "}
                    to write a review
                  </p>
                )}
                {userReview && !isEditingReview && (
                  <div className="mb-6">
                    <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
                      <Check size={16} />
                      You've already reviewed this product
                    </p>
                    <button
                      onClick={() => setIsEditingReview(true)}
                      className="text-sm text-blue-600 hover:underline font-semibold"
                    >
                      Edit your review
                    </button>
                  </div>
                )}

                {reviewMessage && (
                  <div
                    className={`mb-4 p-3 rounded-lg text-sm ${
                      reviewMessage.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {reviewMessage.text}
                  </div>
                )}

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          disabled={!user || (userReview && !isEditingReview)}
                          onClick={() =>
                            setReviewForm({ ...reviewForm, rating: star })
                          }
                          className={`transition-colors disabled:cursor-not-allowed ${star <= reviewForm.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        >
                          <Star
                            size={24}
                            className={
                              star <= reviewForm.rating ? "fill-current" : ""
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Review
                    </label>
                    <textarea
                      rows={4}
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          comment: e.target.value,
                        })
                      }
                      disabled={!user || (userReview && !isEditingReview)}
                      className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        reviewErrors.comment
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 focus:border-blue-600 focus:ring-blue-600"
                      }`}
                      placeholder={
                        user
                          ? "Share your experience..."
                          : "Please login to write a review"
                      }
                    ></textarea>
                    {reviewErrors.comment && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle size={12} /> {reviewErrors.comment}
                      </p>
                    )}
                  </div>

                  {isEditingReview && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingReview(false);
                        setReviewForm({
                          rating: userReview!.rating,
                          comment: userReview!.comment,
                        });
                        setReviewErrors({});
                        setReviewMessage(null);
                      }}
                      className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={
                      isSubmittingReview ||
                      !user ||
                      (userReview && !isEditingReview)
                    }
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isSubmittingReview && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {!user
                      ? "Login to Review"
                      : userReview && !isEditingReview
                        ? "Already Reviewed"
                        : isSubmittingReview
                          ? isEditingReview
                            ? "Updating..."
                            : "Submitting..."
                          : isEditingReview
                            ? "Update Review"
                            : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => {
              const pId = (p as any)._id || p.id;
              return <RelatedProductItem key={pId} product={p} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

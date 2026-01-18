import React, { useEffect, useState } from "react";
import { useShop } from "../context/ShopContext";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { productAPI } from "../apis/product";

const Favorites: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, cart, setWishlist } = useShop();
  const [isValidating, setIsValidating] = useState(true);
  const [removedCount, setRemovedCount] = useState(0);

  // Validate wishlist items on mount - remove deleted products
  useEffect(() => {
    const validateWishlist = async () => {
      if (wishlist.length === 0) {
        setIsValidating(false);
        return;
      }

      try {
        const ids = wishlist.map((item) => (item as any)._id || item.id);
        const response = await productAPI.validateIds(ids);

        if (response.success && response.data.deletedIds.length > 0) {
          // Filter out deleted products from wishlist
          const validItems = wishlist.filter((item) => {
            const itemId = (item as any)._id || item.id;
            return !response.data.deletedIds.includes(itemId);
          });

          setRemovedCount(response.data.deletedIds.length);
          setWishlist(validItems);
        }
      } catch (error) {
        console.error("Error validating wishlist:", error);
      } finally {
        setIsValidating(false);
      }
    };

    validateWishlist();
  }, []); // Only run on mount

  // Check if item is already in cart
  const isInCart = (productId: string) => {
    return cart.some((item) => {
      const itemKey = (item as any)._id || item.id;
      return itemKey === productId;
    });
  };

  if (isValidating) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500">Syncing your wishlist...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <Heart size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Save your favorite products here to easily find them later. Browse our
          collection and click the heart icon to add items.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Notification for removed items */}
        {removedCount > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <AlertTriangle className="text-amber-500 shrink-0" size={20} />
            <p className="text-amber-800">
              <span className="font-bold">
                {removedCount} {removedCount === 1 ? "item" : "items"}
              </span>{" "}
              {removedCount === 1 ? "was" : "were"} removed from your wishlist
              because {removedCount === 1 ? "it is" : "they are"} no longer
              available.
            </p>
            <button
              onClick={() => setRemovedCount(0)}
              className="ml-auto text-amber-600 hover:text-amber-800 font-bold text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            My Favorites
          </h1>
          <span className="text-gray-500 font-medium">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Favorites Items */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Stock</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              <div className="divide-y divide-gray-100">
                {wishlist.map((item) => {
                  const itemKey = (item as any)._id || item.id;
                  const inCart = isInCart(itemKey);
                  const stockStatus =
                    item.stock === 0
                      ? {
                          text: "Out of Stock",
                          color: "text-red-600 bg-red-50",
                        }
                      : item.stock <= 5
                        ? {
                            text: `Only ${item.stock} left`,
                            color: "text-yellow-600 bg-yellow-50",
                          }
                        : {
                            text: "In Stock",
                            color: "text-green-600 bg-green-50",
                          };

                  return (
                    <div
                      key={itemKey}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center"
                    >
                      {/* Product Info */}
                      <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                        <Link
                          to={`/product/${itemKey}`}
                          className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 hover:border-blue-300 transition-colors"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover mix-blend-multiply"
                          />
                        </Link>
                        <div>
                          <Link
                            to={`/product/${itemKey}`}
                            className="font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors block"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500 mb-2">
                            {item.category}
                          </p>
                          <button
                            onClick={() => toggleWishlist(item)}
                            className="text-red-500 text-xs font-bold flex items-center gap-1 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-1 md:col-span-2 md:text-center flex justify-between md:block">
                        <span className="md:hidden text-gray-500 text-sm font-medium">
                          Price:
                        </span>
                        <span className="font-bold text-gray-900">
                          PKR {item.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Stock Status */}
                      <div className="col-span-1 md:col-span-2 md:text-center flex justify-between md:block">
                        <span className="md:hidden text-gray-500 text-sm font-medium">
                          Stock:
                        </span>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${stockStatus.color}`}
                        >
                          {stockStatus.text}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 md:col-span-2 md:text-right flex justify-between md:justify-end gap-2">
                        <span className="md:hidden text-gray-500 text-sm font-medium">
                          Actions:
                        </span>
                        {item.stock === 0 ? (
                          <span className="text-gray-400 text-sm font-medium">
                            Unavailable
                          </span>
                        ) : inCart ? (
                          <Link
                            to="/cart"
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold hover:bg-green-200 transition-colors flex items-center gap-1"
                          >
                            <ShoppingCart size={14} /> In Cart
                          </Link>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1"
                          >
                            <ShoppingCart size={14} /> Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Link
                to="/shop"
                className="text-gray-500 font-bold hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                  <Heart size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">
                    Wishlist
                  </h3>
                  <p className="text-sm text-gray-500">
                    {wishlist.length} saved{" "}
                    {wishlist.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Value</span>
                  <span className="font-bold text-gray-900">
                    PKR{" "}
                    {wishlist
                      .reduce((sum, item) => sum + item.price, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Available Items</span>
                  <span className="font-bold text-green-600">
                    {wishlist.filter((item) => item.stock > 0).length}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Out of Stock</span>
                  <span className="font-bold text-red-600">
                    {wishlist.filter((item) => item.stock === 0).length}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <Link
                  to="/shop"
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wide shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  Continue Shopping <ArrowRight size={18} />
                </Link>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                Items in your wishlist are saved for later
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;

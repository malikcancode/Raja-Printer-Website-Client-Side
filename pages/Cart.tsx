import React, { useEffect, useState } from "react";
import { useShop } from "../context/ShopContext";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { productAPI } from "../apis/product";

const Cart: React.FC = () => {
  const {
    cart,
    setCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useShop();
  const [isValidating, setIsValidating] = useState(true);
  const [removedCount, setRemovedCount] = useState(0);

  // Validate cart items on mount - remove deleted products
  useEffect(() => {
    const validateCart = async () => {
      if (cart.length === 0) {
        setIsValidating(false);
        return;
      }

      try {
        const ids = cart.map((item) => (item as any)._id || item.id);
        const response = await productAPI.validateIds(ids);

        if (response.success && response.data.deletedIds.length > 0) {
          // Filter out deleted products from cart
          const validItems = cart.filter((item) => {
            const itemId = (item as any)._id || item.id;
            return !response.data.deletedIds.includes(itemId);
          });

          setRemovedCount(response.data.deletedIds.length);
          setCart(validItems);
        }
      } catch (error) {
        console.error("Error validating cart:", error);
      } finally {
        setIsValidating(false);
      }
    };

    validateCart();
  }, []); // Only run on mount

  if (isValidating) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500">Syncing your cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. Browse our
          products to find the best printing solutions.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          Start Shopping
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
              {removedCount === 1 ? "was" : "were"} removed from your cart
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

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => {
                  const itemKey = (item as any)._id || item.id;
                  return (
                    <div
                      key={itemKey}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center"
                    >
                      <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover mix-blend-multiply"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {item.category}
                          </p>
                          <button
                            onClick={() => removeFromCart(itemKey)}
                            className="text-red-500 text-xs font-bold flex items-center gap-1 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 md:text-center flex justify-between md:block">
                        <span className="md:hidden text-gray-500 text-sm font-medium">
                          Price:
                        </span>
                        <span className="font-bold text-gray-900">
                          PKR {item.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                        <span className="md:hidden text-gray-500 text-sm font-medium">
                          Quantity:
                        </span>
                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                          <button
                            onClick={() =>
                              updateQuantity(itemKey, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(itemKey, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 md:text-right flex justify-between md:block">
                        <span className="md:hidden text-gray-500 text-sm font-medium">
                          Total:
                        </span>
                        <span className="font-bold text-blue-600">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </span>
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
              <button
                onClick={clearCart}
                className="text-red-500 font-bold hover:text-red-700 text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-extrabold text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">
                    PKR {cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-sm text-gray-500">
                    Calculated at checkout
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    Shipping cost will be calculated based on your location and
                    product weight at checkout
                  </p>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wide shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </Link>

              <p className="text-xs text-gray-400 text-center mt-4">
                Secure Checkout - SSL Encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

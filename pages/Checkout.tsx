import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import {
  CheckCircle,
  CreditCard,
  Truck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { calculateShipping, createOrder } from "../apis/order";

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState<"shipping" | "payment" | "success">(
    "shipping",
  );
  const [loading, setLoading] = useState(false);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const [shippingCost, setShippingCost] = useState({
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    items: [],
  });

  useEffect(() => {
    if (cart.length === 0 && step !== "success") {
      navigate("/shop");
    }
  }, [cart, step, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    // Reset shipping calculation when country changes
    if (e.target.name === "country") {
      setShippingCalculated(false);
    }
  };

  const handleCalculateShipping = async () => {
    if (!shippingInfo.country) {
      setError("Please select a country first");
      return;
    }

    setCalculatingShipping(true);
    setError("");

    try {
      const items = cart.map((item) => ({
        productId: (item as any)._id || item.id,
        quantity: item.quantity,
      }));

      const result = await calculateShipping(items, shippingInfo.country);

      if (result.success) {
        setShippingCost(result.data);
        setShippingCalculated(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to calculate shipping");
    } finally {
      setCalculatingShipping(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingCalculated) {
      setError("Please calculate shipping before placing order");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const items = cart.map((item) => ({
        productId: (item as any)._id || item.id,
        quantity: item.quantity,
      }));

      const orderData = {
        items,
        shippingAddress: {
          country: shippingInfo.country,
          city: shippingInfo.city,
          zipCode: shippingInfo.zipCode,
          addressLine1: shippingInfo.address,
          addressLine2: shippingInfo.addressLine2,
          state: shippingInfo.state,
        },
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone,
        paymentMethod: "card",
        orderNotes: "",
      };

      const result = await createOrder(orderData);

      if (result.success) {
        setOrderId(result.data._id);
        clearCart();
        setStep("success");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Order Confirmed!
          </h2>
          <p className="text-gray-500 mb-4">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
          {orderId && (
            <p className="text-sm text-gray-600 mb-8">
              Order ID: <span className="font-mono font-bold">{orderId}</span>
              <br />
              We've sent a confirmation email to {shippingInfo.email}
            </p>
          )}
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Prevent flash of content if redirecting
  if (cart.length === 0) return null;

  return (
    <div className="pt-12 pb-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            {/* Steps */}
            <div className="flex items-center mb-10">
              <div
                className={`flex items-center gap-2 ${step === "shipping" ? "text-blue-600 font-bold" : "text-gray-900 font-bold"}`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === "shipping" ? "border-blue-600 bg-blue-50" : "border-gray-900 bg-gray-900 text-white"}`}
                >
                  1
                </span>
                Shipping
              </div>
              <div className="h-0.5 w-12 bg-gray-200 mx-4"></div>
              <div
                className={`flex items-center gap-2 ${step === "payment" ? "text-blue-600 font-bold" : "text-gray-400"}`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === "payment" ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}
                >
                  2
                </span>
                Payment
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Shipping Section */}
              <div
                className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-100 ${step === "payment" ? "hidden" : "block"}`}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Truck className="text-blue-600" /> Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      First Name
                    </label>
                    <input
                      required
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Last Name
                    </label>
                    <input
                      required
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700">
                      Email Address
                    </label>
                    <input
                      required
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      type="email"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700">
                      Street Address
                    </label>
                    <input
                      required
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      placeholder="House number and street name"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      name="addressLine2"
                      value={shippingInfo.addressLine2}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Apartment, suite, unit, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Country
                    </label>
                    <select
                      required
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="PK">Pakistan</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="IN">India</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="AE">UAE</option>
                      <option value="SA">Saudi Arabia</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      State/Province (Optional)
                    </label>
                    <input
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      City
                    </label>
                    <input
                      required
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Zip/Postal Code
                    </label>
                    <input
                      required
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Phone Number
                    </label>
                    <input
                      required
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      type="tel"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Calculate Shipping Button */}
                {!shippingCalculated && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleCalculateShipping}
                      disabled={!shippingInfo.country || calculatingShipping}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {calculatingShipping ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Calculating Shipping...
                        </>
                      ) : (
                        "Calculate Shipping Cost"
                      )}
                    </button>
                  </div>
                )}

                {/* Shipping Cost Display */}
                {shippingCalculated && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-700">
                        Items Total:
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        PKR {shippingCost.itemsPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-700">
                        Shipping Cost:
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        PKR {shippingCost.shippingPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-green-300">
                      <span className="font-bold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-green-600">
                        PKR {shippingCost.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && step === "shipping" && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="text-red-600 shrink-0" size={20} />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep("payment")}
                    disabled={!shippingCalculated}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>

              {/* Payment Section */}
              <div
                className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-100 ${step === "shipping" ? "hidden" : "block"}`}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <CreditCard className="text-blue-600" /> Payment Method
                </h2>

                <div className="space-y-4 mb-8">
                  <label className="flex items-center gap-4 p-4 border border-blue-200 bg-blue-50 rounded-xl cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      defaultChecked
                      className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="font-bold text-gray-900">
                      Cash on Delivery
                    </span>
                    <span className="ml-auto text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      Recommended
                    </span>
                  </label>
                  <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer opacity-60">
                    <input
                      type="radio"
                      name="payment"
                      disabled
                      className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="font-bold text-gray-900">
                      Direct Bank Transfer
                    </span>
                    <span className="ml-auto text-xs text-gray-500">
                      Temporarily Unavailable
                    </span>
                  </label>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex gap-3">
                  <AlertCircle className="text-yellow-600 shrink-0" size={20} />
                  <p className="text-sm text-yellow-800">
                    Due to high demand, deliveries might take 3-5 business days.
                    Please ensure your phone number is correct for delivery
                    coordination.
                  </p>
                </div>

                {/* Error Display */}
                {error && step === "payment" && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="text-red-600 shrink-0" size={20} />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="text-gray-500 font-bold hover:text-gray-900"
                  >
                    Back to Shipping
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      `Place Order (PKR ${shippingCost.totalPrice.toLocaleString()})`
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-extrabold text-gray-900 mb-6">
                Your Order
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-blue-600 mt-1">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">
                    PKR {cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900">
                    {shippingCalculated
                      ? `PKR ${shippingCost.shippingPrice.toLocaleString()}`
                      : "Calculated at checkout"}
                  </span>
                </div>
                {shippingCalculated && (
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
                    <span className="font-extrabold text-gray-900">Total</span>
                    <span className="text-xl font-extrabold text-blue-600">
                      PKR {shippingCost.totalPrice.toLocaleString()}
                    </span>
                  </div>
                )}
                {!shippingCalculated && (
                  <div className="pt-3 border-t border-gray-100 mt-3">
                    <p className="text-xs text-gray-500 text-center">
                      Enter your shipping address to calculate total
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

import React from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useShop();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet. Browse our products to find the best printing solutions.</p>
        <Link to="/shop" className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

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
                {cart.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center">
                    <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 text-xs font-bold flex items-center gap-1 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 md:text-center flex justify-between md:block">
                      <span className="md:hidden text-gray-500 text-sm font-medium">Price:</span>
                      <span className="font-bold text-gray-900">PKR {item.price.toLocaleString()}</span>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                      <span className="md:hidden text-gray-500 text-sm font-medium">Quantity:</span>
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 md:text-right flex justify-between md:block">
                      <span className="md:hidden text-gray-500 text-sm font-medium">Total:</span>
                      <span className="font-bold text-blue-600">PKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <Link to="/shop" className="text-gray-500 font-bold hover:text-blue-600 transition-colors flex items-center gap-2">
                ← Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-red-500 font-bold hover:text-red-700 text-sm">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-extrabold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">PKR {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Estimate</span>
                  <span className="font-bold text-gray-900">PKR 500</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (0%)</span>
                  <span className="font-bold text-gray-900">PKR 0</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-extrabold text-blue-600">PKR {(cartTotal + 500).toLocaleString()}</span>
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
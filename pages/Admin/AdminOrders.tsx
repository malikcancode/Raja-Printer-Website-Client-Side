import React from 'react';
import { useShop } from '../../context/ShopContext';
import { OrderStatus } from '../../types';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useShop();

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Manage Orders</h1>
        <p className="text-gray-500">View and update customer order status.</p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 border-dashed">
            <p className="text-gray-500">No orders found.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 p-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                <div className="flex gap-4 items-center">
                  <span className="font-mono font-bold text-gray-900">{order.id}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} /> {order.date}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${getStatusColor(order.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Items */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Items Ordered</h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.quantity} x PKR {item.price.toLocaleString()}</p>
                        </div>
                        <div className="ml-auto font-bold text-sm text-gray-900">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">Total Amount</span>
                    <span className="text-lg font-extrabold text-blue-600">PKR {order.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Customer Details */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Customer Details</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-bold text-gray-900 w-24 inline-block">Name:</span> {order.customer.name}</p>
                    <p><span className="font-bold text-gray-900 w-24 inline-block">Email:</span> {order.customer.email}</p>
                    <p><span className="font-bold text-gray-900 w-24 inline-block">Phone:</span> {order.customer.phone}</p>
                    <p><span className="font-bold text-gray-900 w-24 inline-block">Address:</span> {order.customer.address}, {order.customer.city}</p>
                    <p><span className="font-bold text-gray-900 w-24 inline-block">Payment:</span> {order.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
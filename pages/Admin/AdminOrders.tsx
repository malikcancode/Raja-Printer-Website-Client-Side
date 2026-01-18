import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Mail,
  Phone,
  MapPin,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  getAllOrders,
  updateOrderStatus as updateOrderStatusAPI,
  deleteOrder as deleteOrderAPI,
} from "../../apis/order";

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  weight: number;
  image: string;
  shippingCost: number;
}

interface ApiOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: {
    country: string;
    city: string;
    zipCode: string;
    addressLine1: string;
    addressLine2?: string;
    state?: string;
  };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

const AdminOrders: React.FC = () => {
  const [apiOrders, setApiOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getAllOrders(statusFilter, currentPage, 10);
      if (result.success) {
        setApiOrders(result.data);
        setTotalPages(result.totalPages);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setDeletingOrderId(orderId);
    try {
      const result = await deleteOrderAPI(orderId);
      if (result.success) {
        setApiOrders((prev) => prev.filter((order) => order._id !== orderId));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(null);
        }
        setDeleteConfirmId(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete order");
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const result = await updateOrderStatusAPI(orderId, newStatus);
      if (result.success) {
        setApiOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order,
          ),
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      shipped: "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[statusLower] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    const icons: { [key: string]: any } = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    const Icon = icons[statusLower] || Clock;
    return <Icon size={16} />;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Management
        </h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <>
          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {apiOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-bold text-gray-900">
                        {order.orderNumber || order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customerEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        PKR {order.totalPrice.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items.length} item(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        {deleteConfirmId === order._id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              disabled={deletingOrderId === order._id}
                              className="text-red-600 hover:text-red-800 font-bold text-xs flex items-center gap-1 disabled:opacity-50"
                            >
                              {deletingOrderId === order._id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                "Confirm"
                              )}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-gray-500 hover:text-gray-700 font-bold text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(order._id)}
                            className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {apiOrders.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No orders found
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                Order Details -{" "}
                {selectedOrder.orderNumber ||
                  selectedOrder._id.slice(-8).toUpperCase()}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Customer Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold">Name:</span>
                    {selectedOrder.customerName}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-gray-600" />
                    {selectedOrder.customerEmail}
                  </div>
                  {selectedOrder.customerPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-gray-600" />
                      {selectedOrder.customerPhone}
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Shipping Address
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin size={16} className="text-gray-600 mt-1" />
                    <div>
                      <p>{selectedOrder.shippingAddress.addressLine1}</p>
                      {selectedOrder.shippingAddress.addressLine2 && (
                        <p>{selectedOrder.shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {selectedOrder.shippingAddress.city}
                        {selectedOrder.shippingAddress.state &&
                          `, ${selectedOrder.shippingAddress.state}`}
                      </p>
                      <p>
                        {selectedOrder.shippingAddress.zipCode},{" "}
                        {selectedOrder.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × PKR{" "}
                          {item.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Weight: {item.weight}kg | Shipping: PKR{" "}
                          {item.shippingCost.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Items Total:</span>
                  <span className="font-bold">
                    PKR {selectedOrder.itemsPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping Cost:</span>
                  <span className="font-bold text-blue-600">
                    PKR {selectedOrder.shippingPrice.toLocaleString()}
                  </span>
                </div>
                {selectedOrder.taxPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span className="font-bold">
                      PKR {selectedOrder.taxPrice.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg pt-2 border-t border-gray-300">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-green-600">
                    PKR {selectedOrder.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Update Order Status
                </h3>
                <div className="flex gap-3 items-center">
                  <select
                    defaultValue={selectedOrder.status}
                    onChange={(e) =>
                      handleUpdateStatus(selectedOrder._id, e.target.value)
                    }
                    disabled={updatingStatus}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {updatingStatus && (
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

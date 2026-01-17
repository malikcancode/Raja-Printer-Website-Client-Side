import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Users, Package, ShoppingBag, DollarSign, Clock } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-4 rounded-full ${color} text-white`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-extrabold text-gray-900">{value}</h3>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const { products, orders } = useShop();

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`PKR ${totalSales.toLocaleString()}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Total Orders" value={orders.length.toString()} icon={ShoppingBag} color="bg-blue-500" />
        <StatCard title="Pending Orders" value={pendingOrders.toString()} icon={Clock} color="bg-orange-500" />
        <StatCard title="Total Products" value={products.length.toString()} icon={Package} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.customer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-blue-600">PKR {order.total.toLocaleString()}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Low Stock Alert (Demo)</h3>
          <p className="text-gray-500 text-sm">Inventory tracking is simulated in this version.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
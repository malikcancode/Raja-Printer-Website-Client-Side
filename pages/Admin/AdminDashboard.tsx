import React, { useEffect, useState } from "react";
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  BarChart3,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import {
  dashboardAPI,
  DashboardStats,
  ChartDataPoint,
  TopProduct,
  RecentOrder,
  CategorySales,
} from "../../apis/dashboard";

// Simple Bar Chart Component
const BarChart: React.FC<{
  data: ChartDataPoint[];
  dataKey: "revenue" | "orders";
  color: string;
  height?: number;
}> = ({ data, dataKey, color, height = 200 }) => {
  const maxValue = Math.max(...data.map((d) => d[dataKey]), 1);

  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((item, index) => {
        const barHeight = (item[dataKey] / maxValue) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full flex flex-col items-center justify-end"
              style={{ height: height - 30 }}
            >
              <span className="text-[10px] text-gray-500 font-medium mb-1">
                {dataKey === "revenue"
                  ? `${(item[dataKey] / 1000).toFixed(0)}k`
                  : item[dataKey]}
              </span>
              <div
                className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ${color}`}
                style={{ height: `${Math.max(barHeight, 2)}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Horizontal Bar Chart for Categories
const HorizontalBarChart: React.FC<{ data: CategorySales[] }> = ({ data }) => {
  const maxRevenue = Math.max(...data.map((d) => d.totalRevenue), 1);
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-cyan-500",
  ];

  return (
    <div className="space-y-3">
      {data.slice(0, 6).map((item, index) => (
        <div key={item.category} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700 truncate max-w-[150px]">
              {item.category}
            </span>
            <span className="text-gray-500 font-mono">
              PKR {item.totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${colors[index % colors.length]}`}
              style={{ width: `${(item.totalRevenue / maxRevenue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  trend?: number;
  subtitle?: string;
}> = ({ title, value, icon: Icon, color, trend, subtitle }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-extrabold text-gray-900">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {trend !== undefined && (
        <div
          className={`flex items-center gap-1 text-sm font-bold ${
            trend >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  </div>
);

// Order Status Badge
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueChart, setRevenueChart] = useState<ChartDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<"weekly" | "monthly">(
    "weekly",
  );
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const [statsRes, chartRes, productsRes, ordersRes, categoryRes] =
        await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getRevenueChart(chartPeriod),
          dashboardAPI.getTopProducts(5),
          dashboardAPI.getRecentOrders(5),
          dashboardAPI.getSalesByCategory(),
        ]);

      if (statsRes.success) setStats(statsRes.data);
      if (chartRes.success) setRevenueChart(chartRes.data);
      if (productsRes.success) setTopProducts(productsRes.data);
      if (ordersRes.success) setRecentOrders(ordersRes.data);
      if (categoryRes.success) setCategorySales(categoryRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Refetch chart data when period changes
    const fetchChart = async () => {
      try {
        const chartRes = await dashboardAPI.getRevenueChart(chartPeriod);
        if (chartRes.success) setRevenueChart(chartRes.data);
      } catch (error) {
        console.error("Error fetching chart:", error);
      }
    };
    if (!loading) fetchChart();
  }, [chartPeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-500">
            Welcome back, Admin. Here's what's happening.
          </p>
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`PKR ${(stats?.totals.revenue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="bg-gradient-to-br from-green-500 to-green-600"
          trend={stats?.thisMonth.revenueGrowth}
          subtitle="vs last month"
        />
        <StatCard
          title="Total Orders"
          value={(stats?.totals.orders || 0).toString()}
          icon={ShoppingBag}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          subtitle={`${stats?.today.orders || 0} today`}
        />
        <StatCard
          title="Total Products"
          value={(stats?.totals.products || 0).toString()}
          icon={Package}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          subtitle={`${stats?.inventory.lowStockCount || 0} low stock`}
        />
        <StatCard
          title="Total Customers"
          value={(stats?.totals.users || 0).toString()}
          icon={Users}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Pending Orders</p>
            <h3 className="text-xl font-bold text-gray-900">
              {stats?.orderStatus.pending || 0}
            </h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Truck size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Shipped</p>
            <h3 className="text-xl font-bold text-gray-900">
              {stats?.orderStatus.shipped || 0}
            </h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Delivered</p>
            <h3 className="text-xl font-bold text-gray-900">
              {stats?.orderStatus.delivered || 0}
            </h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
            <ShoppingCart size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">
              Avg. Order Value
            </p>
            <h3 className="text-xl font-bold text-gray-900">
              PKR {(stats?.averageOrderValue || 0).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-600" />
              <h3 className="font-bold text-lg text-gray-900">
                Revenue Overview
              </h3>
            </div>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setChartPeriod("weekly")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  chartPeriod === "weekly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setChartPeriod("monthly")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  chartPeriod === "monthly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          {revenueChart.length > 0 ? (
            <BarChart
              data={revenueChart}
              dataKey="revenue"
              color="bg-gradient-to-t from-blue-500 to-blue-400"
              height={220}
            />
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag size={20} className="text-green-600" />
            <h3 className="font-bold text-lg text-gray-900">Orders Overview</h3>
          </div>
          {revenueChart.length > 0 ? (
            <BarChart
              data={revenueChart}
              dataKey="orders"
              color="bg-gradient-to-t from-green-500 to-green-400"
              height={220}
            />
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            Recent Orders
          </h3>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              No orders yet.
            </p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="font-bold text-sm text-blue-600">
                      PKR {order.totalPrice.toLocaleString()}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-gray-400" />
            Top Selling Products
          </h3>
          {topProducts.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              No sales data yet.
            </p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                >
                  <span className="text-sm font-bold text-gray-400 w-5">
                    #{index + 1}
                  </span>
                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.totalSold} sold
                    </p>
                  </div>
                  <span className="text-sm font-bold text-green-600 shrink-0">
                    PKR {product.totalRevenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-gray-400" />
            Sales by Category
          </h3>
          {categorySales.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              No sales data yet.
            </p>
          ) : (
            <HorizontalBarChart data={categorySales} />
          )}
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats && stats.inventory.lowStockProducts.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-orange-600">
            <AlertTriangle size={20} />
            Low Stock Alert ({stats.inventory.lowStockCount} products)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.inventory.lowStockProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100"
              >
                <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0 border border-orange-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <span
                    className={`text-xs font-bold ${
                      product.stock === 0 ? "text-red-600" : "text-orange-600"
                    }`}
                  >
                    {product.stock === 0
                      ? "Out of Stock"
                      : `${product.stock} left`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-blue-200 text-sm">Today's Revenue</p>
            <p className="text-2xl font-bold">
              PKR {(stats?.today.revenue || 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-blue-200 text-sm">Today's Orders</p>
            <p className="text-2xl font-bold">{stats?.today.orders || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-blue-200 text-sm">This Month Revenue</p>
            <p className="text-2xl font-bold">
              PKR {(stats?.thisMonth.revenue || 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-blue-200 text-sm">Out of Stock</p>
            <p className="text-2xl font-bold">
              {stats?.inventory.outOfStockCount || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

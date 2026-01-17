import React, { Suspense, lazy } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import { ShopProvider, useShop } from "./context/ShopContext";
import {
  MessageCircle,
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
} from "lucide-react";

// Lazy load page components
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() =>
  import("./pages/Auth").then((module) => ({ default: module.Login })),
);
const Register = lazy(() =>
  import("./pages/Auth").then((module) => ({ default: module.Register })),
);
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/Admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/Admin/AdminOrders"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Admin Layout Component
const AdminLayout = () => {
  const { user, logout } = useShop();
  const location = useLocation();

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-col hidden lg:flex fixed h-full">
        <div className="p-6 border-b border-gray-800">
          <span className="font-extrabold text-xl tracking-tighter">
            RAJA ADMIN
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <div key={item.path}>
              {/* Use a div wrapper to use standard anchor navigation if Link causes issues inside context logic, 
                    but here Router Link is fine. Using standard Link. 
                */}
              <a
                href={`#${item.path}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </a>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg w-full transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

// Public Layout Component
const PublicLayout = () => {
  return (
    <>
      <Header />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/923215845098"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/30 transition-all transform hover:-translate-y-1 hover:scale-110 flex items-center justify-center group"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={28} className="fill-current" />
        <span className="absolute right-full mr-3 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
        </span>
      </a>
    </>
  );
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ShopProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-white font-poppins text-gray-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
          <Suspense fallback={<Loader />}>
            <AppRoutes />
          </Suspense>
        </div>
      </ShopProvider>
    </Router>
  );
};

export default App;

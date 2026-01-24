import React, { Suspense, lazy, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import QuoteModal from "./components/QuoteModal";
import { ShopProvider, useShop } from "./context/ShopContext";
import {
  MessageCircle,
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Users,
  Truck,
  UserCog,
  FileText,
  Menu,
  X,
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
const Favorites = lazy(() => import("./pages/Favorites"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/Admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/Admin/AdminOrders"));
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers"));
const AdminShippingZones = lazy(
  () => import("./pages/Admin/AdminShippingZones"),
);
const AdminProfile = lazy(() => import("./pages/Admin/AdminProfile"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route Component - Redirects to login if not authenticated
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { user } = useShop();
  const location = useLocation();

  if (!user) {
    // Redirect to login and save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Admin Layout Component
const AdminLayout = () => {
  const { user, logout } = useShop();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = React.useState(true);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/profile", label: "Profile", icon: UserCog },
    { path: "/admin/shipping-zones", label: "Shipping Zones", icon: Truck },
  ];

  const handleNavClick = () => {
    if (!isLargeScreen) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    if (!isLargeScreen) {
      setIsSidebarOpen(false);
    }
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isLargeScreen ? 0 : isSidebarOpen ? 0 : "-100%",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="w-64 bg-gray-900 text-white flex flex-col fixed h-screen z-40 lg:static lg:translate-x-0 lg:h-screen"
      >
        {/* Close Button for Mobile */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <span className="font-bold text-xl">COPYTECH ADMIN</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <div key={item.path}>
              <a
                href={`#${item.path}`}
                onClick={handleNavClick}
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
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg w-full transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Mobile Menu Button */}
        <div className="lg:hidden p-4 border-b border-gray-200 bg-white flex items-center justify-between sticky top-0 z-20">
          <h1 className="font-bold text-lg text-gray-900">COPYTECH ADMIN</h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-900 hover:text-gray-700 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// Public Layout Component
const PublicLayout = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <>
      <Header />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />

      {/* Get Quote Floating Button - Above WhatsApp */}
      <button
        onClick={() => setIsQuoteModalOpen(true)}
        className="fixed bottom-24 sm:bottom-28 lg:bottom-32 right-4 sm:right-6 lg:right-8 z-40 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-4 lg:px-5 py-3 sm:py-3.5 lg:py-4 rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 hover:scale-110 flex items-center justify-center gap-2 group"
        title="Request a Quote"
      >
        <FileText size={20} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        <span className="font-bold text-xs sm:text-sm hidden md:inline">
          Get Quote
        </span>
        <span className="absolute right-full mr-3 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none md:hidden">
          Request Quote
        </span>
      </button>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/923175223143"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 sm:bottom-6 lg:bottom-8 right-4 sm:right-6 lg:right-8 z-40 bg-[#25D366] text-white p-3 sm:p-3.5 lg:p-4 rounded-full shadow-2xl hover:shadow-green-500/30 transition-all transform hover:-translate-y-1 hover:scale-110 flex items-center justify-center group"
        title="Chat on WhatsApp"
      >
        <MessageCircle
          size={24}
          className="sm:w-6 sm:h-6 lg:w-7 lg:h-7 fill-current"
        />
        <span className="absolute right-full mr-3 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
        </span>
      </a>
    </>
  );
};

const AppRoutes = () => {
  const { user } = useShop();
  const location = useLocation();

  // Auto-redirect based on user role when app loads
  React.useEffect(() => {
    if (user && user.isAdmin && !location.pathname.startsWith("/admin")) {
      // Admin logged in but not on admin route - redirect to admin dashboard
      window.location.hash = "#/admin";
    }
  }, [user, location.pathname]);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="shipping-zones" element={<AdminShippingZones />} />
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

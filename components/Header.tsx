import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  Phone,
  Heart,
  HelpCircle,
  MapPin,
  User,
  ChevronDown,
  Printer,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, user, logout, wishlistCount } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full z-50 transition-all duration-300 ${isScrolled ? "fixed top-0 bg-white/95 backdrop-blur-md shadow-md" : "relative bg-white shadow-sm"}`}
    >
      {/* Top Bar - Hidden on Scroll to save space */}
      <div
        className={`bg-[#1a1a1a] text-white text-[11px] py-2.5 transition-all duration-300 hidden lg:block ${isScrolled ? "h-0 overflow-hidden py-0 opacity-0" : "h-auto opacity-100"}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="font-medium tracking-wide text-gray-300">
            Premium Printing Solutions Partner in Pakistan
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-400 transition-colors text-gray-300">
              <span>PKR</span>
              <ChevronDown size={10} />
            </div>
            <div className="flex items-center space-x-4 border-l border-gray-700 pl-4">
              <Link
                to="/contact"
                className="flex items-center hover:text-blue-400 transition-colors text-gray-300"
              >
                <MapPin size={13} className="mr-1.5" /> Store Locator
              </Link>
              <Link
                to="/contact"
                className="flex items-center hover:text-blue-400 transition-colors text-gray-300"
              >
                <Phone size={13} className="mr-1.5" /> Support
              </Link>
              <Link
                to="/about"
                className="flex items-center hover:text-blue-400 transition-colors text-gray-300"
              >
                <HelpCircle size={13} className="mr-1.5" /> FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div
        className={`transition-all duration-300 ${isScrolled ? "py-3" : "py-6 border-b border-gray-100"}`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between gap-8">
            {/* Mobile Menu & Logo */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu size={24} />
              </button>
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-lg shadow-blue-200 shadow-lg group-hover:scale-105 transition-transform">
                  <Printer size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-2xl tracking-tighter text-gray-900 leading-none group-hover:text-blue-600 transition-colors">
                    RAJA
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                    Business Systems
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-8 text-[13px] font-bold uppercase tracking-wide">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Actions Area */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Search Bar - Desktop */}
              <div className="hidden xl:flex relative group">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-64 pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:border-blue-600 focus:bg-white transition-all focus:w-72 focus:shadow-md"
                />
                <button className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-blue-600 transition-colors">
                  <Search size={18} />
                </button>
              </div>

              {/* Icons */}
              <div className="flex items-center space-x-2 sm:space-x-4 border-l border-gray-100 pl-4 sm:pl-6">
                {user ? (
                  <div className="hidden sm:flex items-center gap-2 group relative">
                    <button
                      className={`p-2 rounded-full transition-all ${user.isAdmin ? "text-white bg-gray-900 hover:bg-gray-800" : "text-blue-600 bg-blue-50 hover:bg-blue-100"}`}
                    >
                      <User size={22} />
                    </button>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user.name}
                        </p>
                      </div>

                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <LayoutDashboard size={14} /> Dashboard
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="hidden sm:block p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                    title="Sign In"
                  >
                    <User size={22} />
                  </Link>
                )}

                <Link
                  to="/favorites"
                  className="hidden sm:block p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all relative group"
                >
                  <Heart size={22} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all relative group"
                >
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="mt-4 lg:hidden relative pb-2">
            <div className="flex w-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-100 transition-all shadow-sm">
              <input
                type="text"
                placeholder="Search for printers, toners..."
                className="flex-1 px-4 py-2.5 bg-transparent outline-none text-sm placeholder-gray-400"
              />
              <button className="px-4 text-gray-500 hover:text-blue-600 border-l border-gray-200 bg-white">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 py-6 px-6 flex flex-col space-y-4 animate-in slide-in-from-top-5 duration-200 h-screen z-50">
          <Link
            to="/"
            className="text-lg font-bold text-blue-600 border-b border-gray-100 pb-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-lg font-medium text-gray-700 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="text-lg font-medium text-gray-700 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-lg font-medium text-gray-700 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Us
          </Link>

          {!user ? (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Link
                to="/login"
                className="text-center py-2 border border-gray-300 rounded-lg text-gray-700 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-center py-2 bg-blue-600 text-white rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-gray-500 text-sm mb-2">
                Logged in as {user.name}
              </p>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="text-blue-600 font-bold flex items-center gap-2 mb-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard size={18} /> Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="text-red-600 font-medium flex items-center gap-2"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg mt-auto mb-20">
            <p className="text-sm font-bold text-gray-900 mb-1">Need help?</p>
            <p className="text-sm text-gray-500 mb-3">Call our support line</p>
            <a
              href="tel:03215845098"
              className="flex items-center text-blue-600 font-bold text-lg"
            >
              <Phone size={18} className="mr-2" /> 0321 5845098
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

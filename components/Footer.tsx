import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  ArrowRight,
  Printer,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { newsletterAPI } from "../apis/newsletter";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await newsletterAPI.subscribe(email);

      if (response.success) {
        setMessage({ type: "success", text: response.message });
        setEmail("");
      } else {
        setMessage({ type: "error", text: response.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to subscribe. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 font-poppins">
      <div className="container mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-gray-800">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center">
              <div className="w-24 h-12 flex items-center justify-center">
                <img src="/PNG.png" alt="" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tighter text-white leading-none">
                  CopyTech.pk
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Your trusted partner for premium office automation solutions. We
              provide top-tier photocopiers, printers, and maintenance services
              across Pakistan.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={Facebook} />
              <SocialLink icon={Twitter} />
              <SocialLink icon={Instagram} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-bold uppercase tracking-wider text-sm">
              Shop
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/shop"
                  className="hover:text-blue-500 transition-colors"
                >
                  Laser Printers
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-blue-500 transition-colors"
                >
                  Photocopiers
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-blue-500 transition-colors"
                >
                  Inks & Toners
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-blue-500 transition-colors"
                >
                  Spare Parts
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-blue-500 transition-colors"
                >
                  Refurbished
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-bold uppercase tracking-wider text-sm">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-500 transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-500 transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-white font-bold uppercase tracking-wider text-sm">
              Stay Updated
            </h4>
            <p className="text-gray-400 text-sm">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-blue-600 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <ArrowRight size={20} />
                  )}
                </button>
              </div>
              {message && (
                <div
                  className={`text-xs font-medium flex items-center gap-2 ${
                    message.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {message.type === "success" && <CheckCircle size={14} />}
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-500 shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase">
                Call Us
              </span>
              <span className="text-white font-medium">
                0317-5223143 | 051-6059089
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-500 shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase">
                Email Us
              </span>
              <span className="text-white font-medium">
                copytech1966@gmail.com
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-500 shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase">
                Visit Us
              </span>
              <span className="text-white font-medium text-sm leading-relaxed">
                G 1 & 2, Souvenir Arcade, High court Road,
                <br />
                Near Gulraiz gate 2, Rawalpindi
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 CopyTech.pk . All Rights Reserved.</p>
          {/* <div className="flex gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa"
              className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all"
            />
          </div> */}
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon: Icon }: { icon: any }) => (
  <a
    href="#"
    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
  >
    <Icon size={16} />
  </a>
);

export default Footer;

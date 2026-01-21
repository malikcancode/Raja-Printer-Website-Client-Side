import React, { useState } from "react";
import { ShoppingCart, Heart, Eye, Star, Check, Loader2 } from "lucide-react";
import { Product } from "../types";
import { useShop } from "../context/ShopContext";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist } = useShop();
  const [isAdding, setIsAdding] = useState(false);

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 transition-all duration-500 ease-in-out group-hover:scale-110"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {product.isHot && (
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
              Hot
            </span>
          )}
          {product.isSale && (
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
              {product.discount || "Sale"}
            </span>
          )}
        </div>

        {/* Wishlist Button (Always Visible) */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 transform hover:scale-110 ${
            isWishlisted
              ? "bg-white text-red-500 shadow-red-100"
              : "bg-white/80 backdrop-blur-sm text-gray-400 hover:bg-white hover:text-red-500"
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${isWishlisted ? "fill-current" : ""}`}
          />
        </button>

        {/* Action Buttons (Desktop Hover) */}
        <div className="hidden md:flex absolute right-3 top-14 flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <Link
            to={`/product/${product.id}`}
            className="w-9 h-9 bg-white text-gray-500 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white shadow-md transition-all hover:scale-110"
            title="View Details"
          >
            <Eye size={16} />
          </Link>
        </div>

        {/* Quick Add Overlay */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none group-hover:pointer-events-auto z-10">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || (product.stock || 0) === 0}
            className={`w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wide shadow-lg transition-colors flex items-center justify-center gap-2 border disabled:opacity-75 disabled:cursor-not-allowed ${
              (product.stock || 0) === 0
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-blue-600 hover:text-white border-gray-100"
            }`}
          >
            {isAdding ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <ShoppingCart size={14} />
            )}
            {(product.stock || 0) === 0
              ? "Out of Stock"
              : isAdding
                ? "Adding..."
                : "Quick Add"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
            {product.category}
          </span>
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-gray-500">
                {product.rating}.0
              </span>
            </div>
          )}
        </div>

        <Link to={`/product/${product.id}`} className="block">
          <h3
            className="font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 group-hover:underline transition-all line-clamp-2 text-sm md:text-base"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        {/* Tags */}
        {product.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.map((tag) => {
              const tagLower = tag.toLowerCase();
              let tagStyles = "bg-gray-100 text-gray-700";
              let iconColor = "text-green-500";

              if (tagLower === "hot") {
                tagStyles = "bg-red-500 text-white";
                iconColor = "text-white";
              } else if (tagLower === "new") {
                tagStyles = "bg-blue-500 text-white";
                iconColor = "text-white";
              } else if (tagLower === "sale") {
                tagStyles = "bg-green-500 text-white";
                iconColor = "text-white";
              }

              return (
                <span
                  key={tag}
                  className={`${tagStyles} px-2 py-1 rounded text-xs flex items-center gap-0.5`}
                >
                  <Check size={10} className={iconColor} /> {tag}
                </span>
              );
            })}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-end justify-between">
          <div>
            {product.originalPrice && product.originalPrice > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-500 line-through font-medium">
                  PKR {product.originalPrice.toLocaleString()}
                </span>
                <span className="text-base md:text-lg font-extrabold text-gray-900 text-blue-600">
                  PKR {product.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-base md:text-lg font-extrabold text-gray-900 text-blue-600">
                PKR {product.price.toLocaleString()}
              </span>
            )}
            <div className="mt-1">
              <span
                className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  (product.stock || 0) === 0
                    ? "bg-red-100 text-red-700"
                    : (product.stock || 0) <= 5
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {(product.stock || 0) === 0
                  ? "Out of Stock"
                  : (product.stock || 0) <= 5
                    ? `Only ${product.stock} left`
                    : "In Stock"}
              </span>
            </div>
          </div>

          {/* Mobile Add Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || (product.stock || 0) === 0}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors md:hidden shadow-sm active:scale-95 ${
              (product.stock || 0) === 0
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white"
            }`}
          >
            {isAdding ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ShoppingCart size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

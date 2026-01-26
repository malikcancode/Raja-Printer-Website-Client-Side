import React, { useState, useMemo, useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../constants";
import {
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Product } from "../types";
import { useShop } from "../context/ShopContext";
import { productAPI } from "../apis/product";

// Reusable Filter Content Component
interface FilterContentProps {
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  products: Product[];
  minPrice: string;
  maxPrice: string;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
  onApplyPriceFilter: () => void;
  onClearPriceFilter: () => void;
  hasPriceFilter: boolean;
}

const FilterContent: React.FC<FilterContentProps> = ({
  selectedCategories,
  toggleCategory,
  products,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  onApplyPriceFilter,
  onClearPriceFilter,
  hasPriceFilter,
}) => {
  // Get unique categories from actual products with counts
  const categoriesWithCounts = React.useMemo(() => {
    const categoryMap = new Map<string, number>();

    products.forEach((product) => {
      const category = product.category;
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Categories</h3>
          {selectedCategories.length > 0 && (
            <button
              onClick={() => toggleCategory("clearAll")}
              className="text-xs text-blue-600 hover:underline font-medium"
              onMouseDown={(e) => e.preventDefault()} // Prevent focus loss issues
            >
              Clear All
            </button>
          )}
        </div>
        <ul className="space-y-3 text-sm">
          {categoriesWithCounts.map((cat) => (
            <li key={cat.name}>
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => toggleCategory(cat.name)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`transition-colors ${selectedCategories.includes(cat.name) ? "text-blue-600 font-bold" : "text-gray-600 group-hover:text-blue-600"}`}
                >
                  {cat.name}
                </span>
                <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                  {cat.count}
                </span>
              </label>
            </li>
          ))}
        </ul>
        {categoriesWithCounts.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No categories available
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Price Range</h3>
          {hasPriceFilter && (
            <button
              onClick={onClearPriceFilter}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                PKR
              </span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full pl-10 py-2 border border-gray-200 rounded-lg text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <span className="text-gray-300">-</span>
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                PKR
              </span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full pl-10 py-2 border border-gray-200 rounded-lg text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <button
            onClick={onApplyPriceFilter}
            className="w-full py-2 bg-gray-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-600 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

// Highlight Match Component
const HighlightMatch: React.FC<{ text: string; highlight: string }> = ({
  text,
  highlight,
}) => {
  if (!highlight.trim()) return <>{text}</>;

  const regex = new RegExp(
    `(${highlight.split(" ").filter(Boolean).join("|")})`,
    "gi",
  );
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="text-blue-600 font-extrabold">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  );
};

const Shop: React.FC = () => {
  const { products: contextProducts, productsLoading } = useShop();
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 9;

  // Read category from URL query parameter on component mount
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategories([decodeURIComponent(categoryParam)]);
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Use sorted products if available, otherwise use context products
  const allProducts = useMemo(() => {
    return sortedProducts.length > 0 || isSorting
      ? sortedProducts
      : contextProducts;
  }, [sortedProducts, contextProducts, isSorting]);

  // Fetch products with sorting
  useEffect(() => {
    const fetchSortedProducts = async () => {
      if (sortBy === "featured") {
        // Use default products from context
        setSortedProducts([]);
        return;
      }

      setIsSorting(true);
      try {
        let sortParam = "";
        switch (sortBy) {
          case "price-asc":
            sortParam = "price-asc";
            break;
          case "price-desc":
            sortParam = "price-desc";
            break;
          case "newest":
            sortParam = "newest";
            break;
        }

        const response = await productAPI.getAll({ sort: sortParam });
        if (response.success && Array.isArray(response.data)) {
          const mappedProducts = response.data.map((product: any) => ({
            ...product,
            id: product._id || product.id,
          }));
          setSortedProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Error fetching sorted products:", error);
        setSortedProducts([]);
      } finally {
        setIsSorting(false);
      }
    };

    fetchSortedProducts();
  }, [sortBy]);

  const toggleCategory = (categoryName: string) => {
    if (categoryName === "clearAll") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(categoryName)
          ? prev.filter((c) => c !== categoryName)
          : [...prev, categoryName],
      );
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleApplyPriceFilter = () => {
    const min = minPrice.trim() ? parseFloat(minPrice) : null;
    const max = maxPrice.trim() ? parseFloat(maxPrice) : null;

    // Validate
    if (min !== null && max !== null && min > max) {
      alert("Minimum price cannot be greater than maximum price");
      return;
    }

    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
    setCurrentPage(1); // Reset to first page
  };

  const handleClearPriceFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    setCurrentPage(1);
  };

  const hasPriceFilter = appliedMinPrice !== null || appliedMaxPrice !== null;

  // Enhanced Filter Logic with Fuzzy Search and Price Range
  const filteredProducts = useMemo(() => {
    let products = allProducts;

    // Category Filter
    if (selectedCategories.length > 0) {
      products = products.filter((product) =>
        selectedCategories.includes(product.category),
      );
    }

    // Price Range Filter
    if (appliedMinPrice !== null) {
      products = products.filter((product) => product.price >= appliedMinPrice);
    }
    if (appliedMaxPrice !== null) {
      products = products.filter((product) => product.price <= appliedMaxPrice);
    }

    // Search Filter (Fuzzy)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const queryWords = query.split(/\s+/).filter(Boolean);

      products = products.filter((product) => {
        const searchableText =
          `${product.name} ${product.category} ${product.tags?.join(" ") || ""}`.toLowerCase();
        // Check if ALL words in the query exist in the product text
        return queryWords.every((word) => searchableText.includes(word));
      });
    }

    return products;
  }, [
    selectedCategories,
    allProducts,
    searchQuery,
    appliedMinPrice,
    appliedMaxPrice,
  ]);

  // Suggestions Logic
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    // Return top 5 matches
    return filteredProducts.slice(0, 5);
  }, [searchQuery, filteredProducts]);

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveSuggestionIndex(-1);
  }, [suggestions]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          const selected = suggestions[activeSuggestionIndex];
          setSearchQuery(selected.name);
          setShowSuggestions(false);
        } else {
          setShowSuggestions(false);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Prevent body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFilterOpen]);

  return (
    <div className="pt-8 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <button
            onClick={() => {
              setSelectedCategories([]);
              setCurrentPage(1);
              setSearchQuery("");
            }}
            className={`hover:text-blue-600 transition-colors ${selectedCategories.length === 0 && !searchQuery ? "font-bold text-gray-900 pointer-events-none" : ""}`}
          >
            Shop
          </button>
          {selectedCategories.length > 0 && (
            <>
              <span className="mx-2 text-gray-300">/</span>
              <span className="font-bold text-gray-900">
                {selectedCategories.length === 1
                  ? selectedCategories[0]
                  : `${selectedCategories.length} Filters`}
              </span>
            </>
          )}
          {searchQuery && (
            <>
              <span className="mx-2 text-gray-300">/</span>
              <span className="font-bold text-gray-900">"{searchQuery}"</span>
            </>
          )}
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Shop All Products
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Browse our extensive collection of printers, copiers, and office
            supplies. Filter by category to find exactly what you need.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <button
              className="flex items-center justify-between w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={18} /> Filter Products
              </span>
              <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
                {selectedCategories.length} active
              </span>
            </button>
          </div>

          {/* Mobile Filter Slide-over Panel */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => setIsMobileFilterOpen(false)}
              ></div>

              {/* Panel */}
              <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                  <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal size={20} /> Filters
                  </h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
                  <FilterContent
                    selectedCategories={selectedCategories}
                    toggleCategory={toggleCategory}
                    products={allProducts}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    setMinPrice={setMinPrice}
                    setMaxPrice={setMaxPrice}
                    onApplyPriceFilter={handleApplyPriceFilter}
                    onClearPriceFilter={handleClearPriceFilter}
                    hasPriceFilter={hasPriceFilter}
                  />
                </div>

                <div className="p-5 border-t border-gray-100 bg-white">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                  >
                    View {filteredProducts.length} Results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterContent
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              products={allProducts}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              onApplyPriceFilter={handleApplyPriceFilter}
              onClearPriceFilter={handleClearPriceFilter}
              hasPriceFilter={hasPriceFilter}
            />
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* Search Bar & Auto-suggestions */}
            <div className="relative mb-6" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for printers, copiers, toners (e.g., 'HP Laser')..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                    setCurrentPage(1);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-gray-900 font-medium"
                />
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  {suggestions.length > 0 ? (
                    <ul>
                      {suggestions.map((product, index) => (
                        <li key={product.id}>
                          <button
                            onClick={() => {
                              setSearchQuery(product.name);
                              setShowSuggestions(false);
                            }}
                            className={`w-full text-left px-4 py-3 flex items-center gap-4 transition-colors border-b border-gray-50 last:border-0 group ${
                              index === activeSuggestionIndex
                                ? "bg-blue-50"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors ${index === activeSuggestionIndex ? "text-blue-700" : ""}`}
                              >
                                <HighlightMatch
                                  text={product.name}
                                  highlight={searchQuery}
                                />
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-500">
                                  {product.category}
                                </p>
                                <span
                                  className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
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
                                      ? `${product.stock} left`
                                      : "In Stock"}
                                </span>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No matches found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {filteredProducts.length > 0 ? startIndex + 1 : 0}
                </span>{" "}
                -{" "}
                <span className="font-bold text-gray-900">
                  {Math.min(endIndex, filteredProducts.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900">
                  {filteredProducts.length}
                </span>{" "}
                results
              </span>
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm text-gray-500 hidden sm:inline">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-sm border-none bg-gray-50 py-2 pl-4 pr-10 rounded-lg font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors focus:ring-0 outline-none"
                  disabled={isSorting}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCategories.length > 0 || hasPriceFilter) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-blue-200 transition-colors"
                  >
                    {cat} <X size={14} />
                  </button>
                ))}
                {hasPriceFilter && (
                  <button
                    onClick={handleClearPriceFilter}
                    className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-green-200 transition-colors"
                  >
                    PKR {appliedMinPrice || 0} - {appliedMaxPrice || "∞"}{" "}
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Grid */}
            {productsLoading || isSorting ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 font-medium">
                    Loading products...
                  </p>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 border-dashed">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Search size={32} />
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  No products found matching your selection.
                </p>
                <p className="text-gray-400 text-sm mt-1 mb-6">
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setCurrentPage(1);
                    setSearchQuery("");
                    handleClearPriceFilter();
                  }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > itemsPerPage && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-500"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-md"
                            : "border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-500"
                  >
                    <ChevronRight size={18} />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

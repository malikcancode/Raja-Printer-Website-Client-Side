import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import ProductCard from "../components/ProductCard";
import { CATEGORIES, BANNERS, BRANDS, TESTIMONIALS } from "../constants";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const Home: React.FC = () => {
  const { products } = useShop();
  // Get top 4 products for home page display
  const displayProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col w-full relative">
      <Hero />

      {/* Features - Floating Over Hero/Content */}
      <div className="container mx-auto px-4 relative z-20">
        <Features />
      </div>

      {/* Categories Grid */}
      <section className="py-20 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2 block">
                Our Catalog
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Shop By Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group"
            >
              View All Categories{" "}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat) => (
              <Link to="/shop" key={cat.id} className="group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden mb-4 aspect-square bg-gray-50 border border-gray-100 group-hover:border-blue-200 group-hover:shadow-lg transition-all duration-500">
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors z-10"></div>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-bold text-gray-800 text-sm md:text-sm text-center group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-gray-400 text-xs text-center mt-1">
                  {cat.count} items
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-3 block">
              Top Sellers
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Trending Printing Solutions
            </h2>
            <p className="text-gray-500">
              Discover our most popular printers and copiers, selected for
              performance and reliability.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-900 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
            >
              Load More Products
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted Brands */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-10">
            Trusted By Global Leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {BRANDS.map((brand, index) => (
              <img
                key={index}
                src={brand}
                alt="Brand"
                className="h-8 md:h-16 object-contain hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="py-20 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {BANNERS.map((banner) => (
              <div
                key={banner.id}
                className="relative rounded-2xl overflow-hidden group h-80 lg:h-96 shadow-lg"
              >
                <div className="absolute inset-0 bg-gray-900">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-60"
                  />
                </div>
                <div
                  className={`absolute inset-0 p-8 flex flex-col justify-end items-start bg-gradient-to-t from-black/80 via-transparent to-transparent`}
                >
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-400">
                    {banner.subtitle}
                  </h4>
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-6 leading-tight max-w-[250px]">
                    {banner.title}
                  </h3>
                  <Link
                    to="/shop"
                    className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white hover:text-gray-900 transition-all flex items-center gap-2 group/btn"
                  >
                    {banner.buttonText}{" "}
                    <ArrowUpRight
                      size={16}
                      className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-blue-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-500">
              Trusted by over 5000+ businesses across Pakistan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
              >
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {t.name}
                    </h4>
                    <p className="text-xs text-blue-600 font-medium">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-4 bg-blue-600 overflow-hidden whitespace-nowrap relative z-10">
        <div className="inline-flex animate-marquee items-center gap-12 text-white/90">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-12">
              <span className="text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                Authorized Ricoh Dealer
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
              <span className="text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                Expert Maintenance Services
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
              <span className="text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                Genuine HP Supplies
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
            </div>
          ))}
        </div>
      </div>

      {/* Large CTA */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 transform origin-bottom translate-x-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
              Ready to Upgrade Your Office Print Fleet?
            </h2>
            <p className="text-gray-400 mb-10 text-lg md:text-xl max-w-2xl mx-auto">
              Get a customized quote for your business. We offer lease, rental,
              and purchase options for all major brands.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="bg-blue-600 text-white px-10 py-4 rounded-lg font-bold shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-all hover:-translate-y-1 inline-flex items-center justify-center"
              >
                Request a Quote
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border border-gray-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-gray-800 transition-all hover:-translate-y-1 inline-flex items-center justify-center"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

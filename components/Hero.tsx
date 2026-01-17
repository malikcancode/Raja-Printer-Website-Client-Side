
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SLIDES } from '../constants';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden group bg-gray-900">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Gradient Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[12000ms] ease-linear transform scale-100 hover:scale-110"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
             <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 lg:px-12">
              <div className={`max-w-3xl transform transition-all duration-1000 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-12 h-1 bg-blue-500 rounded-full"></span>
                  <h3 className="text-blue-400 font-bold uppercase tracking-[0.2em] text-sm md:text-base text-shadow-sm">
                    {slide.subtitle}
                  </h3>
                </div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-gray-300 text-lg mb-10 max-w-xl leading-relaxed">
                  Discover the latest in office automation technology. Efficient, reliable, and cost-effective solutions tailored for your enterprise needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/shop" className="bg-blue-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/30 hover:shadow-blue-600/40 hover:-translate-y-1 flex items-center justify-center gap-2 group/btn">
                    Browse Printers
                    <Printer size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/contact" className="bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-lg font-bold hover:bg-white hover:text-gray-900 transition-all backdrop-blur-sm hover:-translate-y-1 inline-flex items-center justify-center">
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <div className="absolute bottom-12 right-6 lg:right-12 z-20 flex gap-2">
        <button 
          onClick={prevSlide}
          className="w-12 h-12 border border-white/20 hover:bg-blue-600 hover:border-blue-600 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={nextSlide}
          className="w-12 h-12 border border-white/20 hover:bg-blue-600 hover:border-blue-600 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-12 left-6 lg:left-12 z-20 flex space-x-3">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentSlide ? 'bg-blue-500 w-12' : 'bg-white/30 w-6 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;

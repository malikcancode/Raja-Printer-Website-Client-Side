import React from 'react';
import { Award, Users, ThumbsUp, Printer } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-12 pb-24 bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Pioneering Printing Solutions Since 2005</h1>
        <p className="text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed">
          Raja Business Systems is Pakistan's leading provider of office automation technology. We specialize in high-performance printing solutions that empower businesses to achieve more.
        </p>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000" alt="Office" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-blue-900/10"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Founded in Rawalpindi, Raja Business Systems started with a simple mission: to provide reliable, cost-effective printing solutions to local businesses. Over the years, we have grown into a premier supplier of imported and refurbished photocopiers, laser printers, and genuine consumables.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We are official dealers for major brands and pride ourselves on our after-sales support. Our team of certified technicians ensures that your office operations never come to a halt.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-blue-600 rounded-3xl p-12 text-white mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-500/50">
            <div>
              <div className="text-4xl font-extrabold mb-2">15+</div>
              <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-2">5k+</div>
              <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-2">10k+</div>
              <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Machines Sold</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-2">24/7</div>
              <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Expert Support</div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm mx-auto mb-6">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quality First</h3>
            <p className="text-gray-500 text-sm">We only stock products that meet rigorous quality standards, ensuring longevity and performance.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm mx-auto mb-6">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Customer Focused</h3>
            <p className="text-gray-500 text-sm">Your business continuity is our priority. We offer tailored solutions to fit your specific needs.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm mx-auto mb-6">
              <ThumbsUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Integrity</h3>
            <p className="text-gray-500 text-sm">We believe in transparent pricing and honest advice. No hidden costs, just great service.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
import React from 'react';
import { FEATURES } from '../constants';

const Features: React.FC = () => {
  if (!FEATURES || FEATURES.length === 0) return null;

  return (
    <section className="bg-white border-b border-gray-100 relative z-20 -mt-16 mx-4 md:mx-auto max-w-7xl rounded-xl shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="p-8 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {Icon && <Icon size={28} />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base">{feature.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm mt-1">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
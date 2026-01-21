import React from "react";
import { FEATURES } from "../constants";

const Features: React.FC = () => {
  if (!FEATURES || FEATURES.length === 0) return null;

  return (
    <section className="bg-white border-b border-gray-100 relative z-20 -mt-4 sm:-mt-12 lg:-mt-16 mx-4 sm:mx-6 md:mx-8 lg:mx-auto max-w-7xl rounded-xl shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 sm:p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shrink-0">
                {Icon && <Icon size={24} className="sm:w-7 sm:h-7" />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm mt-1 leading-snug">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;

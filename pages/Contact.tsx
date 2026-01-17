import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="pt-12 pb-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-gray-500 text-lg">Have questions about our printers or need a custom quote? We're here to help.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase mb-1">Phone</p>
                    <p className="text-lg font-bold text-gray-900">0321 5845098</p>
                    <p className="text-sm text-gray-500">Mon-Sat 9am to 6pm</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase mb-1">Email</p>
                    <p className="text-lg font-bold text-gray-900">info@rajasystems.pk</p>
                    <p className="text-sm text-gray-500">Online support 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase mb-1">Office</p>
                    <p className="text-lg font-bold text-gray-900">Raja Business Systems</p>
                    <p className="text-sm text-gray-500">Saddar, Rawalpindi, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-64 bg-gray-100 rounded-2xl overflow-hidden relative">
               <img 
                 src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" 
                 alt="Map" 
                 className="w-full h-full object-cover opacity-60 grayscale"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 <button className="bg-white px-6 py-2 rounded-full font-bold text-gray-900 shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                   <MapPin size={16} className="text-blue-600" /> View on Google Maps
                 </button>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 lg:p-10 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Phone</label>
                  <input type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="0300 1234567" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Subject</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-gray-600">
                  <option>General Inquiry</option>
                  <option>Sales Quote</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none" placeholder="How can we help you today?"></textarea>
              </div>
              <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                Send Message <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
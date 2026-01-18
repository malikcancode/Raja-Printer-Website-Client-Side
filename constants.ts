import { Product, Category, Banner } from "./types";
import { Truck, ShieldCheck, Clock, PenTool } from "lucide-react";

export const ADMIN_CREDENTIALS = {
  email: "admin@inventerdesignstudio.com",
  password: "Malik@123#@!",
};

export const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Laser Printers",
    image:
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=500",
    count: 42,
  },
  {
    id: "2",
    name: "Multifunction Copiers",
    image:
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=500",
    count: 51,
  },
  {
    id: "3",
    name: "Production Printers",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=500",
    count: 18,
  },
  {
    id: "4",
    name: "Original Toners",
    image:
      "https://i.pinimg.com/736x/66/1f/d4/661fd4ca8a9103d0127627dc651ee4dd.jpg",
    count: 156,
  },
  {
    id: "5",
    name: "ID Card Printers",
    image:
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=500",
    count: 11,
  },
  {
    id: "6",
    name: "Spare Parts",
    image:
      "https://i.pinimg.com/1200x/fa/63/11/fa631110f4fa927067903c772b6859f7.jpg",
    count: 131,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "HP Color LaserJet Pro M452dn",
    category: "Laser Printers",
    price: 1050.0,
    image:
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=500",
    rating: 5,
    isHot: true,
    tags: ["Network Ready", "Duplex"],
  },
  {
    id: "2",
    name: "Canon imageRUNNER 2204N",
    category: "Photocopiers",
    price: 125000.0,
    originalPrice: 135000.0,
    image:
      "https://images.unsplash.com/photo-1517430816045-df4b7de8db98?auto=format&fit=crop&q=80&w=500",
    rating: 5,
    isSale: true,
    discount: "-8%",
    tags: ["A3", "Heavy Duty"],
  },
  {
    id: "3",
    name: "Ricoh MP C305 SPF Color",
    category: "Refurbished Copiers",
    price: 70000.0,
    originalPrice: 75000.0,
    image:
      "https://images.unsplash.com/photo-1563124330-9799270b2e87?auto=format&fit=crop&q=80&w=500",
    rating: 4,
    isSale: true,
    discount: "-7%",
  },
  {
    id: "4",
    name: "HP 93A Black Toner Cartridge",
    category: "Supplies",
    price: 6900.0,
    originalPrice: 7800.0,
    image:
      "https://images.unsplash.com/photo-1588619461336-2d07ae763593?auto=format&fit=crop&q=80&w=500",
    rating: 5,
    isHot: true,
    isSale: true,
    discount: "-12%",
  },
  {
    id: "5",
    name: "Epson EcoTank L3150 Wi-Fi",
    category: "Inkjet Printers",
    price: 35000.0,
    image:
      "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=500",
    rating: 4,
    tags: ["Wireless", "Ink Tank"],
  },
  {
    id: "6",
    name: "Samsung 2850S Toner",
    category: "Supplies",
    price: 4000.0,
    image:
      "https://images.unsplash.com/photo-1595514020139-38e2193b2102?auto=format&fit=crop&q=80&w=500",
    rating: 3,
  },
];

export const BANNERS: Banner[] = [
  {
    id: "1",
    title: "Professional Office Printing",
    subtitle: "Upgrade Your Fleet",
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800",
    buttonText: "View Solutions",
    theme: "dark",
  },
  {
    id: "2",
    title: "High Volume Production",
    subtitle: "Industrial Grade",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRdATXhdWjStov0R1jti5YVD4W3082SpkZOg&s",
    buttonText: "Shop Heavy Duty",
    theme: "light",
  },
  {
    id: "3",
    title: "Genuine Consumables",
    subtitle: "Best Quality Prints",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
    buttonText: "Buy Toners",
    theme: "dark",
  },
];

export const SLIDES = [
  {
    id: 1,
    title: "Premium Photocopiers & Office Solutions",
    subtitle: "Authorized Dealer & Service",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: 2,
    title: "High-Performance Laser Printers",
    subtitle: "Efficiency for Your Business",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: 3,
    title: "Cost-Effective Refurbished Machines",
    subtitle: "Quality Tested & Guaranteed",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1600",
  },
];

export const FEATURES = [
  {
    icon: Truck,
    title: "Nationwide Shipping",
    description: "Fast delivery across Pakistan",
  },
  {
    icon: ShieldCheck,
    title: "Official Warranty",
    description: "100% genuine products guaranteed",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Expert technical assistance",
  },
  {
    icon: PenTool,
    title: "Installation Service",
    description: "Professional setup included",
  },
];

export const BRANDS = [
  "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2O73uqwedL4b_oHeCX3WZEYxT7Stf7fxl0w&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ90eqNXfVJrs3Q7HAmt9CUNs0Wed-Z1V5zaw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp28KNbT_76szjMx8V-F90zVouUYg3BblgtA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSu323_8hg0UCy82DuKjskPE9DvF9oVD3JCA&s",
  "https://www.konicaminolta.com/img/fb_top01.png",
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Ahmed Khan",
    role: "IT Manager, TechCorp",
    content:
      "Raja Business Systems provided us with an excellent fleet of printers. Their after-sales support is unmatched in Rawalpindi.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 2,
    name: "Sarah Ahmed",
    role: "Principal, Beacon School",
    content:
      "We needed reliable copiers for our exam season. The team guided us perfectly and the refurbished machines work like new.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 3,
    name: "Usman Malik",
    role: "CEO, Malik Enterprises",
    content:
      "Genuine toners delivered to our doorstep within 24 hours. Highly recommended for business supplies.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
  },
];

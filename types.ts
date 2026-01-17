export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  isHot?: boolean;
  isSale?: boolean;
  discount?: string;
  tags?: string[];
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  theme: 'dark' | 'light';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  email: string;
  name: string;
  isAdmin?: boolean;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
}
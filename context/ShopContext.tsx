import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, User, Order, OrderStatus } from "../types";
import { INITIAL_PRODUCTS } from "../constants";
import { authAPI } from "../apis/auth";

interface ShopContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  user: User | null;
  login: (
    email: string,
    pass: string,
  ) => Promise<{ success: boolean; message?: string; isAdmin?: boolean }>;
  logout: () => void;

  wishlist: Product[];
  toggleWishlist: (product: Product) => void;

  orders: Order[];
  placeOrder: (orderData: Omit<Order, "id" | "date" | "status">) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("raja_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(() => {
    // Load user from localStorage immediately
    const savedUser = localStorage.getItem("raja_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("raja_orders");
    return saved ? JSON.parse(saved) : [];
  });
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Check for existing auth token on mount and validate
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const response = await authAPI.getMe();
          if (response.success) {
            const userData = {
              email: response.data.user.email,
              name: response.data.user.name,
              isAdmin: response.data.user.role === "admin",
            };
            setUser(userData);
            localStorage.setItem("raja_user", JSON.stringify(userData));
          } else {
            // Token invalid, clear it
            localStorage.removeItem("auth_token");
            localStorage.removeItem("raja_user");
            setUser(null);
          }
        } catch (error) {
          // Token invalid or network error, clear it
          localStorage.removeItem("auth_token");
          localStorage.removeItem("raja_user");
          setUser(null);
        }
      } else {
        // No token, clear user
        localStorage.removeItem("raja_user");
        setUser(null);
      }
      setIsAuthChecked(true);
    };

    checkAuth();
  }, []);

  // Persistence Effects
  useEffect(() => {
    const savedCart = localStorage.getItem("raja_cart");
    const savedWishlist = localStorage.getItem("raja_wishlist");

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  useEffect(
    () => localStorage.setItem("raja_products", JSON.stringify(products)),
    [products],
  );
  useEffect(
    () => localStorage.setItem("raja_cart", JSON.stringify(cart)),
    [cart],
  );
  useEffect(
    () => localStorage.setItem("raja_wishlist", JSON.stringify(wishlist)),
    [wishlist],
  );
  useEffect(
    () => localStorage.setItem("raja_orders", JSON.stringify(orders)),
    [orders],
  );

  // Product Management
  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Cart Management
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  // Auth Management
  const login = async (email: string, pass: string) => {
    try {
      const response = await authAPI.login({ email, password: pass });

      if (response.success) {
        const { user, token } = response.data;

        // Store token
        localStorage.setItem("auth_token", token);

        // Set user in context and localStorage
        const userData = {
          email: user.email,
          name: user.name,
          isAdmin: user.role === "admin",
        };
        setUser(userData);
        localStorage.setItem("raja_user", JSON.stringify(userData));

        return {
          success: true,
          isAdmin: user.role === "admin",
        };
      }

      return {
        success: false,
        message: response.message || "Login failed",
      };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Network error. Please try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("raja_user");
  };

  // Wishlist Management
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Order Management
  const placeOrder = (orderData: Omit<Order, "id" | "date" | "status">) => {
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      status: "Pending",
      ...orderData,
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        user,
        login,
        logout,
        wishlist,
        toggleWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};

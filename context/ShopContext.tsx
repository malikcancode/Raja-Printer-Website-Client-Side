import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, User, Order, OrderStatus } from "../types";
import { authAPI } from "../apis/auth";
import { productAPI } from "../apis/product";

interface ShopContextType {
  products: Product[];
  productsLoading: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  refreshProducts: () => Promise<void>;

  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
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
  register: (
    name: string,
    email: string,
    pass: string,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;

  wishlist: Product[];
  setWishlist: React.Dispatch<React.SetStateAction<Product[]>>;
  toggleWishlist: (product: Product) => void;
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;

  orders: Order[];
  placeOrder: (orderData: Omit<Order, "id" | "date" | "status">) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

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
  const [isCartInitialized, setIsCartInitialized] = useState(false);

  // Fetch products from API
  const refreshProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await productAPI.getAll();
      if (response.success && Array.isArray(response.data)) {
        // Map products to ensure they have both id and _id fields for compatibility
        const mappedProducts = response.data.map((product: any) => ({
          ...product,
          id: product._id || product.id, // Use _id as id for compatibility
        }));
        setProducts(mappedProducts);
      } else {
        // Fallback to empty array if API fails
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      // Fallback to empty array on error
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    refreshProducts();
  }, []);

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
              profilePicture: response.data.user.profilePicture || "",
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

  // Persistence Effects - Load from localStorage first
  useEffect(() => {
    const savedCart = localStorage.getItem("raja_cart");
    const savedWishlist = localStorage.getItem("raja_wishlist");

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCart(parsedCart);
        }
      } catch (e) {
        console.error("Error parsing saved cart:", e);
      }
    }
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist) && parsedWishlist.length > 0) {
          setWishlist(parsedWishlist);
        }
      } catch (e) {
        console.error("Error parsing saved wishlist:", e);
      }
    }

    // Mark as initialized after loading
    setIsCartInitialized(true);
  }, []);

  // Save cart, wishlist, and orders to localStorage (removed products since they come from API)
  // Only persist cart items that have _id (from database), filter out mock/constant items
  // Only save after initial load is complete to prevent overwriting with empty array
  useEffect(() => {
    if (!isCartInitialized) return;
    const dbCartItems = cart.filter((item) => (item as any)._id);
    localStorage.setItem("raja_cart", JSON.stringify(dbCartItems));
  }, [cart, isCartInitialized]);
  // Only persist wishlist items that have _id (from database), filter out mock/constant items
  useEffect(() => {
    if (!isCartInitialized) return;
    const dbWishlistItems = wishlist.filter((item) => (item as any)._id);
    localStorage.setItem("raja_wishlist", JSON.stringify(dbWishlistItems));
  }, [wishlist, isCartInitialized]);
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
      // Use _id for matching if available, fallback to id
      const productKey = (product as any)._id || product.id;
      const existing = prev.find((item) => {
        const itemKey = (item as any)._id || item.id;
        return itemKey === productKey;
      });

      if (existing) {
        return prev.map((item) => {
          const itemKey = (item as any)._id || item.id;
          return itemKey === productKey
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        const itemKey = (item as any)._id || item.id;
        return itemKey !== productId;
      }),
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => {
        const itemKey = (item as any)._id || item.id;
        return itemKey === productId ? { ...item, quantity } : item;
      }),
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

  const register = async (name: string, email: string, pass: string) => {
    try {
      const response = await authAPI.register({ name, email, password: pass });

      if (response.success) {
        const { user, token } = response.data;

        // Store token
        localStorage.setItem("auth_token", token);

        // Set user in context and localStorage
        const userData = {
          email: user.email,
          name: user.name,
          isAdmin: user.role === "admin",
          profilePicture: (user as any).profilePicture || "",
        };
        setUser(userData);
        localStorage.setItem("raja_user", JSON.stringify(userData));

        return {
          success: true,
        };
      }

      return {
        success: false,
        message: response.message || "Registration failed",
      };
    } catch (error: any) {
      console.error("Registration error:", error);
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
      const productKey = (product as any)._id || product.id;
      const exists = prev.find((p) => {
        const pKey = (p as any)._id || p.id;
        return pKey === productKey;
      });
      if (exists) {
        return prev.filter((p) => {
          const pKey = (p as any)._id || p.id;
          return pKey !== productKey;
        });
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => {
      const pKey = (p as any)._id || p.id;
      return pKey === productId;
    });
  };

  const wishlistCount = wishlist.length;

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
        productsLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        user,
        login,
        register,
        logout,
        wishlist,
        setWishlist,
        toggleWishlist,
        wishlistCount,
        isInWishlist,
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

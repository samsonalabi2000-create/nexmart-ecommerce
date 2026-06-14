/**
 * API Service Layer
 * 
 * Architecture: Adapter pattern
 * - When VITE_API_URL is set and server is reachable → uses real HTTP API
 * - Otherwise → falls back to mock data (localStorage-backed)
 * 
 * All components only import from this file — zero coupling to transport layer.
 */

import axios from "axios";
import { PRODUCTS, CATEGORIES, BRANDS, TESTIMONIALS, FLASH_SALES, BEST_SELLERS, NEW_ARRIVALS } from "@/lib/mockData";
import { sleep } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL;
const USE_MOCK = !API_URL;

// Axios instance (used when server is connected)
const api = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nexmart_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("nexmart_token");
      localStorage.removeItem("nexmart_user");
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(err);
  }
);

// ─── Mock Helpers ─────────────────────────────────────────────────────────────

const mockDelay = () => sleep(Math.random() * 300 + 100);

function getLocalStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const productService = {
  async getAll(params = {}) {
    if (USE_MOCK) {
      await mockDelay();
      let results = [...PRODUCTS];
      if (params.category) results = results.filter((p) => p.category === params.category);
      if (params.search) results = results.filter((p) => p.name.toLowerCase().includes(params.search.toLowerCase()));
      if (params.minPrice) results = results.filter((p) => p.price >= params.minPrice);
      if (params.maxPrice) results = results.filter((p) => p.price <= params.maxPrice);
      if (params.brand) results = results.filter((p) => p.brand.toLowerCase() === params.brand.toLowerCase());
      if (params.sort === "price-asc") results.sort((a, b) => a.price - b.price);
      if (params.sort === "price-desc") results.sort((a, b) => b.price - a.price);
      if (params.sort === "rating") results.sort((a, b) => b.rating - a.rating);
      if (params.sort === "newest") results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      const page = params.page || 1;
      const limit = params.limit || 12;
      const start = (page - 1) * limit;
      return { products: results.slice(start, start + limit), total: results.length, page, totalPages: Math.ceil(results.length / limit) };
    }
    const { data } = await api.get("/products", { params });
    return data;
  },

  async getById(id) {
    if (USE_MOCK) {
      await mockDelay();
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) throw new Error("Product not found");
      return product;
    }
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  async getBestSellers() {
    if (USE_MOCK) { await mockDelay(); return BEST_SELLERS; }
    const { data } = await api.get("/products/best-sellers");
    return data;
  },

  async getNewArrivals() {
    if (USE_MOCK) { await mockDelay(); return NEW_ARRIVALS; }
    const { data } = await api.get("/products/new-arrivals");
    return data;
  },

  async getFlashSales() {
    if (USE_MOCK) { await mockDelay(); return FLASH_SALES; }
    const { data } = await api.get("/products/flash-sales");
    return data;
  },

  async getFeatured() {
    if (USE_MOCK) { await mockDelay(); return PRODUCTS.slice(0, 6); }
    const { data } = await api.get("/products/featured");
    return data;
  },

  async getRelated(id, category) {
    if (USE_MOCK) {
      await mockDelay();
      return PRODUCTS.filter((p) => p.category === category && p.id !== id).slice(0, 6);
    }
    const { data } = await api.get(`/products/${id}/related`);
    return data;
  },

  async search(query) {
    if (USE_MOCK) {
      await mockDelay();
      return PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8);
    }
    const { data } = await api.get("/products/search", { params: { q: query } });
    return data;
  },
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoryService = {
  async getAll() {
    if (USE_MOCK) { await mockDelay(); return CATEGORIES; }
    const { data } = await api.get("/categories");
    return data;
  },
};

// ─── Cart (localStorage for guest, server for authenticated) ──────────────────

export const cartService = {
  async getCart() {
    if (USE_MOCK) {
      const items = getLocalStorage("nexmart_cart", []);
      return { items, total: items.reduce((s, i) => s + i.price * i.quantity, 0) };
    }
    const token = localStorage.getItem("nexmart_token");
    if (!token) {
      const items = getLocalStorage("nexmart_cart", []);
      return { items, total: items.reduce((s, i) => s + i.price * i.quantity, 0) };
    }
    const { data } = await api.get("/cart");
    return data;
  },

  async addItem(product, quantity = 1, variant = null) {
    const item = { ...product, quantity, variant, cartId: `${product.id}-${variant || "default"}` };
    if (USE_MOCK || !localStorage.getItem("nexmart_token")) {
      const items = getLocalStorage("nexmart_cart", []);
      const existing = items.find((i) => i.cartId === item.cartId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push(item);
      }
      setLocalStorage("nexmart_cart", items);
      return { items, total: items.reduce((s, i) => s + i.price * i.quantity, 0) };
    }
    const { data } = await api.post("/cart/items", { productId: product.id, quantity, variant });
    return data;
  },

  async updateQuantity(cartId, quantity) {
    if (USE_MOCK || !localStorage.getItem("nexmart_token")) {
      const items = getLocalStorage("nexmart_cart", []);
      const item = items.find((i) => i.cartId === cartId);
      if (item) item.quantity = quantity;
      setLocalStorage("nexmart_cart", items);
      return { items, total: items.reduce((s, i) => s + i.price * i.quantity, 0) };
    }
    const { data } = await api.put(`/cart/items/${cartId}`, { quantity });
    return data;
  },

  async removeItem(cartId) {
    if (USE_MOCK || !localStorage.getItem("nexmart_token")) {
      let items = getLocalStorage("nexmart_cart", []);
      items = items.filter((i) => i.cartId !== cartId);
      setLocalStorage("nexmart_cart", items);
      return { items, total: items.reduce((s, i) => s + i.price * i.quantity, 0) };
    }
    const { data } = await api.delete(`/cart/items/${cartId}`);
    return data;
  },

  async clearCart() {
    setLocalStorage("nexmart_cart", []);
    if (!USE_MOCK && localStorage.getItem("nexmart_token")) {
      await api.delete("/cart");
    }
  },
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export const wishlistService = {
  async getWishlist() {
    const items = getLocalStorage("nexmart_wishlist", []);
    if (!USE_MOCK && localStorage.getItem("nexmart_token")) {
      try {
        const { data } = await api.get("/wishlist");
        return data;
      } catch { return items; }
    }
    return items;
  },

  async toggle(product) {
    const items = getLocalStorage("nexmart_wishlist", []);
    const exists = items.find((i) => i.id === product.id);
    const newItems = exists ? items.filter((i) => i.id !== product.id) : [...items, product];
    setLocalStorage("nexmart_wishlist", newItems);
    if (!USE_MOCK && localStorage.getItem("nexmart_token")) {
      try {
        await api[exists ? "delete" : "post"](`/wishlist/${product.id}`);
      } catch {}
    }
    return { items: newItems, added: !exists };
  },

  isInWishlist(productId) {
    const items = getLocalStorage("nexmart_wishlist", []);
    return items.some((i) => i.id === productId);
  },
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authService = {
  async login(email, password) {
    if (USE_MOCK) {
      await mockDelay();
      const mockUser = { id: "u001", name: "Demo User", email, avatar: null, role: "user", loyaltyPoints: 2450 };
      const mockToken = "mock_token_" + Date.now();
      localStorage.setItem("nexmart_token", mockToken);
      localStorage.setItem("nexmart_user", JSON.stringify(mockUser));
      return { user: mockUser, token: mockToken };
    }
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("nexmart_token", data.token);
    localStorage.setItem("nexmart_user", JSON.stringify(data.user));
    return data;
  },

  async register(name, email, password) {
    if (USE_MOCK) {
      await mockDelay();
      const mockUser = { id: "u002", name, email, avatar: null, role: "user", loyaltyPoints: 0 };
      const mockToken = "mock_token_" + Date.now();
      localStorage.setItem("nexmart_token", mockToken);
      localStorage.setItem("nexmart_user", JSON.stringify(mockUser));
      return { user: mockUser, token: mockToken };
    }
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("nexmart_token", data.token);
    localStorage.setItem("nexmart_user", JSON.stringify(data.user));
    return data;
  },

  async logout() {
    localStorage.removeItem("nexmart_token");
    localStorage.removeItem("nexmart_user");
    if (!USE_MOCK) {
      try { await api.post("/auth/logout"); } catch {}
    }
  },

  getCurrentUser() {
    return getLocalStorage("nexmart_user", null);
  },

  isAuthenticated() {
    return !!localStorage.getItem("nexmart_token");
  },

  async getProfile() {
    if (USE_MOCK) {
      const user = getLocalStorage("nexmart_user", null);
      return user;
    }
    const { data } = await api.get("/auth/me");
    return data;
  },

  async updateProfile(profileData) {
    if (USE_MOCK) {
      await mockDelay();
      const user = getLocalStorage("nexmart_user", {});
      const updated = { ...user, ...profileData };
      setLocalStorage("nexmart_user", updated);
      return updated;
    }
    const { data } = await api.put("/auth/profile", profileData);
    setLocalStorage("nexmart_user", data);
    return data;
  },
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orderService = {
  async getOrders() {
    if (USE_MOCK) {
      await mockDelay();
      return getLocalStorage("nexmart_orders", [
        {
          id: "ORD-2024-001",
          date: "2024-08-15",
          status: "delivered",
          total: 185000,
          items: [PRODUCTS[0]],
          trackingNumber: "NX123456789NG",
        },
        {
          id: "ORD-2024-002",
          date: "2024-08-20",
          status: "shipped",
          total: 95000,
          items: [PRODUCTS[3]],
          trackingNumber: "NX987654321NG",
        },
      ]);
    }
    const { data } = await api.get("/orders");
    return data;
  },

  async createOrder(orderData) {
    if (USE_MOCK) {
      await mockDelay();
      const order = {
        id: "ORD-" + Date.now(),
        date: new Date().toISOString().split("T")[0],
        status: "processing",
        ...orderData,
        trackingNumber: "NX" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      };
      const orders = getLocalStorage("nexmart_orders", []);
      orders.unshift(order);
      setLocalStorage("nexmart_orders", orders);
      return order;
    }
    const { data } = await api.post("/orders", orderData);
    return data;
  },

  async getById(id) {
    if (USE_MOCK) {
      const orders = getLocalStorage("nexmart_orders", []);
      return orders.find((o) => o.id === id);
    }
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
};

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviewService = {
  async getProductReviews(productId) {
    if (USE_MOCK) {
      await mockDelay();
      return [
        { id: "r1", productId, userId: "u1", userName: "Tunde Bakare", rating: 5, comment: "Absolutely perfect! Exceeded all my expectations. Fast delivery too.", date: "3 days ago", verified: true },
        { id: "r2", productId, userId: "u2", userName: "Ngozi Williams", rating: 4, comment: "Great product, very happy with the quality. Would definitely buy again.", date: "1 week ago", verified: true },
        { id: "r3", productId, userId: "u3", userName: "Segun Adesanya", rating: 5, comment: "Best purchase I've made this year. The quality is unmatched.", date: "2 weeks ago", verified: false },
      ];
    }
    const { data } = await api.get(`/products/${productId}/reviews`);
    return data;
  },

  async addReview(productId, review) {
    if (USE_MOCK) {
      await mockDelay();
      return { id: "r" + Date.now(), productId, ...review, date: "Just now", verified: false };
    }
    const { data } = await api.post(`/products/${productId}/reviews`, review);
    return data;
  },
};

// ─── Brands ───────────────────────────────────────────────────────────────────

export const brandService = {
  async getAll() {
    if (USE_MOCK) { await mockDelay(); return BRANDS; }
    const { data } = await api.get("/brands");
    return data;
  },
};

export default api;
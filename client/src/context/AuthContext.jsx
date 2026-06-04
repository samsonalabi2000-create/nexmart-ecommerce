import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "@/services/api";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const loadCart = useCartStore((s) => s.loadCart);
  const loadWishlist = useWishlistStore((s) => s.loadWishlist);

  // Sync server-side session on mount
  useEffect(() => {
    if (authService.isAuthenticated()) {
      authService.getProfile().then((profile) => {
        if (profile) setUser(profile);
      }).catch(() => {});
      loadCart();
      loadWishlist();
    } else {
      loadCart(); // load guest cart from localStorage
    }
  }, []);

  // Listen for forced logout (401 from API)
  useEffect(() => {
    const handler = () => { setUser(null); };
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { user: u } = await authService.login(email, password);
      setUser(u);
      await loadCart();
      await loadWishlist();
      toast.success(`Welcome back, ${u.name.split(" ")[0]}!`, {
        icon: "👋",
        style: { background: "#1a1a1a", color: "#fff", border: "1px solid #D4AF37" },
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const { user: u } = await authService.register(name, email, password);
      setUser(u);
      toast.success(`Welcome to NexMart, ${u.name.split(" ")[0]}!`, {
        icon: "🎉",
        style: { background: "#1a1a1a", color: "#fff", border: "1px solid #D4AF37" },
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    useCartStore.getState().clearCart();
    toast.success("Logged out successfully");
  }, []);

  const updateProfile = useCallback(async (data) => {
    const updated = await authService.updateProfile(data);
    setUser(updated);
    return updated;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

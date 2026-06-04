import { create } from "zustand";

export const useUIStore = create((set, get) => ({
  theme: localStorage.getItem("nexmart_theme") || "dark",
  searchOpen: false,
  mobileMenuOpen: false,
  quickViewProduct: null,

  setTheme: (theme) => {
    localStorage.setItem("nexmart_theme", theme);
    // Apply immediately to <html>
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem("nexmart_theme", next);
    // Apply immediately to <html>
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
    set({ theme: next });
  },

  setSearchOpen: (open) => set({ searchOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setQuickViewProduct: (product) => set({ quickViewProduct: product }),
}));






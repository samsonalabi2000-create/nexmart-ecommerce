import { create } from "zustand";

export const useUIStore = create((set) => ({
  theme: localStorage.getItem("nexmart_theme") || "dark",
  searchOpen: false,
  mobileMenuOpen: false,
  quickViewProduct: null,

  setTheme: (theme) => {
    localStorage.setItem("nexmart_theme", theme);
    set({ theme });
  },

  toggleTheme: () => {
    const current = localStorage.getItem("nexmart_theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("nexmart_theme", next);
    set({ theme: next });
  },

  setSearchOpen: (open) => set({ searchOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setQuickViewProduct: (product) => set({ quickViewProduct: product }),
}));

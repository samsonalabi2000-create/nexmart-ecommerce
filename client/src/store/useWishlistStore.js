import { create } from "zustand";
import { wishlistService } from "@/services/api";
import toast from "react-hot-toast";

export const useWishlistStore = create((set, get) => ({
  items: [],

  loadWishlist: async () => {
    const items = await wishlistService.getWishlist();
    set({ items: Array.isArray(items) ? items : [] });
  },

  toggle: async (product) => {
    const result = await wishlistService.toggle(product);
    set({ items: result.items });
    toast.success(result.added ? "Added to wishlist ❤️" : "Removed from wishlist", {
      style: { background: "#1a1a1a", color: "#fff", border: "1px solid #333" },
    });
  },

  isInWishlist: (productId) => {
    return get().items.some((i) => i.id === productId);
  },
}));

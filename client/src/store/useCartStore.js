import { create } from "zustand";
import { cartService } from "@/services/api";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  isOpen: false,

  setOpen: (open) => set({ isOpen: open }),

  loadCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await cartService.getCart();
      set({
        items: cart.items,
        total: cart.total,
        itemCount: cart.items.reduce((s, i) => s + i.quantity, 0),
      });
    } catch {
      // silent fail — cart stays empty
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (product, quantity = 1, variant = null) => {
    try {
      const cart = await cartService.addItem(product, quantity, variant);
      set({
        items: cart.items,
        total: cart.total,
        itemCount: cart.items.reduce((s, i) => s + i.quantity, 0),
      });
      toast.success(`${product.name.slice(0, 25)}... added to cart`, {
        icon: "🛒",
        style: { background: "#1a1a1a", color: "#fff", border: "1px solid #D4AF37" },
      });
    } catch {
      toast.error("Failed to add item");
    }
  },

  updateQuantity: async (cartId, quantity) => {
    if (quantity < 1) return get().removeItem(cartId);
    try {
      const cart = await cartService.updateQuantity(cartId, quantity);
      set({
        items: cart.items,
        total: cart.total,
        itemCount: cart.items.reduce((s, i) => s + i.quantity, 0),
      });
    } catch {
      toast.error("Failed to update quantity");
    }
  },

  removeItem: async (cartId) => {
    try {
      const cart = await cartService.removeItem(cartId);
      set({
        items: cart.items,
        total: cart.total,
        itemCount: cart.items.reduce((s, i) => s + i.quantity, 0),
      });
      toast.success("Item removed", {
        style: { background: "#1a1a1a", color: "#fff" },
      });
    } catch {
      toast.error("Failed to remove item");
    }
  },

  clearCart: async () => {
    await cartService.clearCart();
    set({ items: [], total: 0, itemCount: 0 });
  },
}));

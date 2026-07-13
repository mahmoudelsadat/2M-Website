import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type Product } from '@/lib/data';

// ─── Cart ────────────────────────────────────────────────────

export interface CartItem extends Product {
  qty: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return { items: [...state.items, { ...product, qty }] };
        });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) => {
        if (qty <= 0) { get().removeItem(id); return; }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((n, i) => n + i.qty, 0),

      subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    {
      name: '2m-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Zustand persist needs serializable state — store as array, expose as Set
interface WishlistPersisted {
  idsArr: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistPersisted>()(
  persist(
    (set, get) => ({
      idsArr: [],

      toggle: (id) => {
        const current = get().idsArr;
        if (current.includes(id)) {
          set({ idsArr: current.filter((i) => i !== id) });
        } else {
          set({ idsArr: [...current, id] });
        }
      },

      has: (id) => get().idsArr.includes(id),

      clear: () => set({ idsArr: [] }),
    }),
    {
      name: '2m-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

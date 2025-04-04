import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);

        if (existingItem) {
          // Update quantity if item already exists
          const updatedItems = currentItems.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );

          set((state) => ({
            items: updatedItems,
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + item.price * item.quantity,
          }));
        } else {
          // Add new item
          set((state) => ({
            items: [...state.items, item],
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + item.price * item.quantity,
          }));
        }
      },

      removeItem: (id) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find((i) => i.id === id);

        if (itemToRemove) {
          set((state) => ({
            items: state.items.filter((i) => i.id !== id),
            totalItems: state.totalItems - itemToRemove.quantity,
            totalPrice:
              state.totalPrice - itemToRemove.price * itemToRemove.quantity,
          }));
        }
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;

        const currentItems = get().items;
        const itemToUpdate = currentItems.find((i) => i.id === id);

        if (itemToUpdate) {
          const quantityDiff = quantity - itemToUpdate.quantity;
          const updatedItems = currentItems.map((i) =>
            i.id === id ? { ...i, quantity } : i
          );

          set((state) => ({
            items: updatedItems,
            totalItems: state.totalItems + quantityDiff,
            totalPrice: state.totalPrice + itemToUpdate.price * quantityDiff,
          }));
        }
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },
    }),
    {
      name: "phonehub-cart",
    }
  )
);

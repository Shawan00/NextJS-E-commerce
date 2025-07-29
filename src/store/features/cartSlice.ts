import { ProductType } from "@/schemaValidation/product.schema";
import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
  product: ProductType;
  quantity: number;
}

const initialState = {
  items: [] as CartItem[],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
    updateCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      if (item) {
        if (quantity > item.product.stock) {
          item.quantity = item.product.stock;
        } else {
          item.quantity = quantity;
        }
      }
      if (item && item.quantity <= 0) {
        state.items = state.items.filter(item => item.product.id !== productId);
      }
    },
    removeFromCart: (state, action) => {
      const { productId } = action.payload;
      state.items = state.items.filter(item => item.product.id !== productId);
    },
    removeMultipleFromCart: (state, action) => {
      const { productIds } = action.payload;
      state.items = state.items.filter(item => !productIds.includes(item.product.id));
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateCartItemQuantity, removeFromCart, removeMultipleFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product } from './productsSlice'

export type CartItem = {
  product: Product
  quantity: number
}

const initialState: { stavke: CartItem[] } = {
  stavke: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const postojecaStavka = state.stavke.find(
        item => item.product.id === action.payload.product.id
      );

      if (postojecaStavka) {
        postojecaStavka.quantity += action.payload.quantity;
      } else {
        state.stavke.push(action.payload);
      }
    },

    updateQuantity: (state, action: PayloadAction<{ id: string, quantity: number }>) => {
      const item = state.stavke.find(i => i.product.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.stavke = state.stavke.filter(
        item => item.product.id !== action.payload
      );
    },

    clearCart: (state) => {
      state.stavke = [];
    }
  }
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
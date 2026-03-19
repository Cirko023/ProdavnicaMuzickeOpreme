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
        dodajUKorpu: (state, action: PayloadAction<CartItem>) => {
            state.stavke.push(action.payload)
        },

        azurirajKolicinu: (state, action: PayloadAction<{ id: string, quantity: number }>) => {
            const item = state.stavke.find(i => i.product.id === action.payload.id)
            if (item) {
                item.quantity = action.payload.quantity
            }
        },

        ukloniIzKorpe: (state, action: PayloadAction<string>) =>{
            state.stavke = state.stavke.filter(
                item => item.product.id !== action.payload
            )
        },
        ocistiKorpu: (state) => {
            state.stavke = []
        }

    }
})

export const { dodajUKorpu, azurirajKolicinu, ukloniIzKorpe, ocistiKorpu } = cartSlice.actions
export default cartSlice.reducer
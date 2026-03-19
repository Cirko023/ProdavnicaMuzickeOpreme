import { FA5Style } from '@expo/vector-icons/build/FontAwesome5'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: 'gitare' | 'pedale' | 'oprema'
  image?: string
  stock: number
  brand?: string
  createdAt?: any
  updatedAt?: any
}

type ProductsState = {
    proizvodi: Product[]
    ucitava: boolean
}

const initialState: ProductsState = {
    proizvodi: [],
    ucitava: false
}

const productsSlice = createSlice({
    name: 'products',
    initialState,

    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.proizvodi = action.payload
        },

        addProduct: (state, action: PayloadAction<Product>) => {
            state.proizvodi.push(action.payload)
        },

        removeProduct: (state, action: PayloadAction<string>) => {
            state.proizvodi = state.proizvodi.filter(
                product => product.id !== action.payload
            )
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.ucitava = action.payload
        }
    }
})

export const { setProducts, addProduct, removeProduct, setLoading } = productsSlice.actions

export default productsSlice.reducer

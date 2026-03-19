import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import authReducer from './authSlice'
import productsReducer from './productsSlice'
import ordersReducer from './ordersSlice'

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        auth: authReducer,
        products: productsReducer,
        orders: ordersReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
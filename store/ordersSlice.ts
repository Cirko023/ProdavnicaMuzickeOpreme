import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem } from './cartSlice'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type OrderItem = {
    productId: string
    quantity: number
}

export type Order = {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: any
  shippingAddress?: string
  phone?: string
}

type OrdersState = {
    porudzbine: Order[]
    ucitava: boolean
}

const initialState: OrdersState = {
    porudzbine: [],
    ucitava: false
}

const ordersSlice = createSlice({
    name: 'orders',
    initialState,

    reducers: {
        setOrders: (state, action: PayloadAction<Order[]>) => {
            state.porudzbine = action.payload
        },

        addOrder: (state, action: PayloadAction<Order>) => {
            state.porudzbine.push(action.payload)
        },

    updateOrderStatus: (state, action: PayloadAction<{id: string, status: Order['status']}>) => {
        const order = state.porudzbine.find(o => o.id === action.payload.id)

        if(order) {
            order.status = action.payload.status
        }
        },

    removeOrder: (state, action: PayloadAction<string>) => {
        state.porudzbine = state.porudzbine.filter(
            order => order.id !== action.payload
        )
        },

    setOrdersLoading: (state, action: PayloadAction<boolean>) => {
        state.ucitava = action.payload
        }
    }
})

export const { setOrders, addOrder, updateOrderStatus, removeOrder, setOrdersLoading } = ordersSlice.actions

export default ordersSlice.reducer
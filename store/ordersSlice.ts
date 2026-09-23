import {
  createOrder,
  subscribeToOrders,
  updateOrderStatus as updateOrderInDb,
} from "@/services/orders";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Order = {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: any;
  shippingAddress?: string;
  phone?: string;
};

type OrdersState = {
  porudzbine: Order[];
  ucitava: boolean;
};

const initialState: OrdersState = {
  porudzbine: [],
  ucitava: false,
};

export const startOrdersListener = () => (dispatch: any) => {
  dispatch(setOrdersLoading(true));

  return subscribeToOrders((orders) => {
    dispatch(setOrders(orders));
    dispatch(setOrdersLoading(false));
  });
};

export const addOrderThunk = createAsyncThunk(
  "orders/addOrder",
  async (orderData: any) => {
    const id = await createOrder(orderData);
    return id;
  },
);

export const updateStatusThunk = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }: { id: string; status: Order["status"] }) => {
    await updateOrderInDb(id, status);
  },
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.porudzbine = action.payload;
    },
    setOrdersLoading: (state, action: PayloadAction<boolean>) => {
      state.ucitava = action.payload;
    },
  },
});

export const { setOrders, setOrdersLoading } = ordersSlice.actions;
export default ordersSlice.reducer;

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
  greska: string | null;
};

const initialState: OrdersState = {
  porudzbine: [],
  ucitava: false,
  greska: null,
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
  async (orderData: any, { rejectWithValue }) => {
    try {
      const id = await createOrder(orderData);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Greška pri kreiranju porudžbine"
      );
    }
  },
);

export const updateStatusThunk = createAsyncThunk(
  "orders/updateStatus",
  async (
    { id, status }: { id: string; status: Order["status"] },
    { rejectWithValue }
  ) => {
    try {
      await updateOrderInDb(id, status);
      return { id, status };
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Greška pri izmeni statusa porudžbine"
      );
    }
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
    clearOrdersError: (state) => {
      state.greska = null;
    },
  },
  extraReducers: (builder) => {
    //addOrder
    builder
      .addCase(addOrderThunk.pending, (state) => {
        state.ucitava = true;
        state.greska = null;
      })
      .addCase(addOrderThunk.fulfilled, (state) => {
        state.ucitava = false;
      })
      .addCase(addOrderThunk.rejected, (state, action) => {
        state.ucitava = false;
        state.greska = (action.payload as string) || "Nepoznata greška";
      });

    //updateStatus
    builder
      .addCase(updateStatusThunk.pending, (state) => {
        state.ucitava = true;
        state.greska = null;
      })
      .addCase(updateStatusThunk.fulfilled, (state) => {
        state.ucitava = false;
      })
      .addCase(updateStatusThunk.rejected, (state, action) => {
        state.ucitava = false;
        state.greska = (action.payload as string) || "Nepoznata greška";
      });
  },
});

export const { setOrders, setOrdersLoading, clearOrdersError } = ordersSlice.actions;
export default ordersSlice.reducer;
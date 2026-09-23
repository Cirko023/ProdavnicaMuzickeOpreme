import {
  createProduct as createProductInDb,
  deleteProduct as deleteProductFromDb,
  subscribeToProducts,
  updateProduct as updateProductInDb
} from '@/services/products';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'gitare' | 'pedale' | 'oprema';
  image?: string;
  stock: number;
  brand?: string;
  createdAt?: any;
  updatedAt?: any;
};

type ProductsState = {
  proizvodi: Product[];
  ucitava: boolean;
  greska: string | null;
};

const initialState: ProductsState = {
  proizvodi: [],
  ucitava: false,
  greska: null,
};


export const startProductsListener = () => (dispatch: any) => {
  dispatch(setLoading(true));
  
  return subscribeToProducts((products) => {
    dispatch(setProducts(products));
    dispatch(setLoading(false));
  });
};


export const addProductThunk = createAsyncThunk(
  "products/addProduct", 
  async (productData: any, { rejectWithValue }) => {
    try {
      const id = await createProductInDb(productData);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Greška pri dodavanju proizvoda"
      );
    }
  }
);


export const deleteProductThunk = createAsyncThunk(
  "products/deleteProduct", 
  async (productId: string, { rejectWithValue }) => {
    try {
      await deleteProductFromDb(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Greška pri brisanju proizvoda"
      );
    }
  }
);


export const updateProductThunk = createAsyncThunk(
  "products/updateProduct",
  async (
    { id, data }: { id: string, data: Partial<Product> }, 
    { rejectWithValue }
  ) => {
    try {
      await updateProductInDb(id, data);
      return { id, data };
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Greška pri izmeni proizvoda"
      );
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.proizvodi = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.ucitava = action.payload;
    },
    clearError: (state) => {
      state.greska = null;
    }
  },
  extraReducers: (builder) => {
    //addProduct
    builder
      .addCase(addProductThunk.pending, (state) => {
        state.ucitava = true;
        state.greska = null;
      })
      .addCase(addProductThunk.fulfilled, (state) => {
        state.ucitava = false;
      })
      .addCase(addProductThunk.rejected, (state, action) => {
        state.ucitava = false;
        state.greska = (action.payload as string) || "Nepoznata greška";
      });

    //deleteProduct
    builder
      .addCase(deleteProductThunk.pending, (state) => {
        state.ucitava = true;
        state.greska = null;
      })
      .addCase(deleteProductThunk.fulfilled, (state) => {
        state.ucitava = false;
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.ucitava = false;
        state.greska = (action.payload as string) || "Nepoznata greška";
      });

    //updateProduct 
    builder
      .addCase(updateProductThunk.pending, (state) => {
        state.ucitava = true;
        state.greska = null;
      })
      .addCase(updateProductThunk.fulfilled, (state) => {
        state.ucitava = false;
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.ucitava = false;
        state.greska = (action.payload as string) || "Nepoznata greška";
      });
  }
});

export const { setProducts, setLoading, clearError } = productsSlice.actions;
export default productsSlice.reducer;
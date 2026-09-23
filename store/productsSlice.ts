import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  subscribeToProducts, 
  createProduct as createProductInDb, 
  deleteProduct as deleteProductFromDb,
  updateProduct as updateProductInDb
} from '@/services/products';

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
};

const initialState: ProductsState = {
  proizvodi: [],
  ucitava: false,
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
  async (productData: any) => {
    await createProductInDb(productData);
  }
);


export const deleteProductThunk = createAsyncThunk(
  "products/deleteProduct", 
  async (productId: string) => {
    await deleteProductFromDb(productId);
  }
);


export const updateProductThunk = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }: { id: string, data: Partial<Product> }) => {
    await updateProductInDb(id, data);
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
    }
  }
});

export const { setProducts, setLoading } = productsSlice.actions;
export default productsSlice.reducer;
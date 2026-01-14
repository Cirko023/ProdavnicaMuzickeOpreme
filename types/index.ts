export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'gitare' | 'pedale' | 'oprema';
  image?: string;
  stock: number;
  brand?: string;
  createdAt: any;
  updatedAt: any;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any;
  shippingAddress?: string;
  phone?: string;
}

export interface User{
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}
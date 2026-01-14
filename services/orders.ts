import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Order, CartItem } from '@/types';

export const createOrder = async (userId: string, items: CartItem[], shippingAddress?: string, phone?: string): Promise<string> => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  const order: Omit<Order, 'id'> = {
    userId,
    items,
    total,
    status: 'pending',
    createdAt: new Date(),
    shippingAddress,
    phone,
  };
  
  const docRef = await addDoc(collection(db, 'orders'), order);
  return docRef.id;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
};

export const getOrder = async (id: string): Promise<Order | null> => {
  const docRef = doc(db, 'orders', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Order;
  }
  return null;
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<void> => {
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, { status });
};

export const getAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
};

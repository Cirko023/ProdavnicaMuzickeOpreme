import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Product } from '@/store/productsSlice';


// Pomocna funkcija koja konvertuje podatke sa firestorea u obican JS objekat
const transformDoc = (doc: any) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt,
    updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : data.updatedAt,
  };
};

export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(transformDoc) as Product[];
    callback(products);
  });
};

export const createProduct = async (productData: any): Promise<string> => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    ...product,
    updatedAt: new Date(),
  });
};

export const getProducts = async (category?: string): Promise<Product[]> => {
  let q;
  if (category) {
    q = query(collection(db, 'products'), where('category', '==', category), orderBy('createdAt', 'desc'));
  } else {
    q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(transformDoc) as Product[];
};

export const getProduct = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return transformDoc(docSnap) as Product;
  }
  return null;
};

export const searchProducts = async (searchTerm: string, category?: string): Promise<Product[]> => {
  const products = await getProducts(category);
  const term = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term) ||
      product.brand?.toLowerCase().includes(term)
  );
};
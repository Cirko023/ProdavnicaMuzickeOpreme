import { db } from "@/config/firebase";
import type { Order } from "@/store/ordersSlice";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const serializeTimestamp = (value: any): any => {
  if (value === null || value === undefined) return value;
  // koristi nanosekunde zbog firestora 
  if (
    typeof value === "object" &&
    "seconds" in value &&
    "nanoseconds" in value
  ) {
    return value.toMillis ? value.toMillis() : value.seconds * 1000;
  }

  return value;
};

const deepSerialize = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "object" && "seconds" in obj && "nanoseconds" in obj) {
    return serializeTimestamp(obj);
  }
  // prolazi kroz svaki element
  if (Array.isArray(obj)) {
    return obj.map(deepSerialize);
  }

  // prolazi kroz svaki ključ
  if (typeof obj === "object") {
    const result: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      result[key] = deepSerialize(obj[key]);
    }
    return result;
  }

  return obj;
};

const transformOrderDoc = (doc: any) => {
  const data = doc.data();
  return deepSerialize({
    id: doc.id,
    ...data,
  });
};

export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(transformOrderDoc) as Order[];
    callback(orders);
  });
};

export const createOrder = async (orderData: any): Promise<string> => {
  const total = orderData.items.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0,
  );

  const finalOrder = {
    ...orderData,
    total,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const docRef = await addDoc(collection(db, "orders"), finalOrder);
  return docRef.id;
};

export const updateOrderStatus = async (
  id: string,
  status: Order["status"],
): Promise<void> => {
  const docRef = doc(db, "orders", id);
  await updateDoc(docRef, {
    status,
    updatedAt: new Date(),
  });
};

export const getAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(transformOrderDoc) as Order[];
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(transformOrderDoc) as Order[];
};

export const getOrder = async (id: string): Promise<Order | null> => {
  const docRef = doc(db, "orders", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return transformOrderDoc(docSnap) as Order;
  }
  return null;
};

import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQ58pBnyuI843o7Ai27WWfPP4Oj7ER4G0",
  authDomain: "prodavnicamuzickeopreme-72634.firebaseapp.com",
  projectId: "prodavnicamuzickeopreme-72634",
  storageBucket: "prodavnicamuzickeopreme-72634.firebasestorage.app",
  messagingSenderId: "1086334795962",
  appId: "1:1086334795962:web:a2f8ea3af4c59d5d254283",
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Inicijalizacija Auth
const auth = getAuth(app);

// Inicijalizacija Firestore
const db = getFirestore(app);

export { auth, db };
export default app;

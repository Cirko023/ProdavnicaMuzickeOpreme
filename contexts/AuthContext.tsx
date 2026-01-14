import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface KorisnickiPodaci {
  uid: string;
  email: string;
  uloga: 'korisnik' | 'admin';
  ime?: string;
  telefon?: string;
  adresa?: string;
  omiljeniProizvodi?: string[];
  istorijaPorudzbina?: any[];
}

interface AuthContextType {
  korisnik: User | null;
  korisnickiPodaci: KorisnickiPodaci | null;
  ucitava: boolean;
  prijava: (email: string, lozinka: string) => Promise<void>;
  registracija: (email: string, lozinka: string, ime: string) => Promise<void>;
  odjava: () => Promise<void>;
  azurirajKorisnickePodatke: (podaci: Partial<KorisnickiPodaci>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [korisnik, setKorisnik] = useState<User | null>(null);
  const [korisnickiPodaci, setKorisnickiPodaci] = useState<KorisnickiPodaci | null>(null);
  const [ucitava, setUcitava] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error('Firebase Auth nije inicijalizovan');
      setUcitava(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseKorisnik) => {
        try {
          setKorisnik(firebaseKorisnik);
          
          if (firebaseKorisnik) {
            // Učitaj korisničke podatke iz Firestore
            try {
              const korisnickiDokument = await getDoc(doc(db, 'users', firebaseKorisnik.uid));
              if (korisnickiDokument.exists()) {
                const podaci = korisnickiDokument.data();
                setKorisnickiPodaci({ 
                  uid: firebaseKorisnik.uid, 
                  email: podaci.email,
                  uloga: podaci.uloga || (podaci.role === 'admin' ? 'admin' : 'korisnik'),
                  ime: podaci.ime || podaci.name,
                  telefon: podaci.telefon || podaci.phone,
                  adresa: podaci.adresa || podaci.address,
                  omiljeniProizvodi: podaci.omiljeniProizvodi || podaci.favoriteProducts || [],
                  istorijaPorudzbina: podaci.istorijaPorudzbina || podaci.orderHistory || [],
                } as KorisnickiPodaci);
              } else {
                setKorisnickiPodaci(null);
              }
            } catch (greska) {
              console.error('Greška pri učitavanju korisničkih podataka:', greska);
              setKorisnickiPodaci(null);
            }
          } else {
            setKorisnickiPodaci(null);
          }
        } catch (greska) {
          console.error('Greška u onAuthStateChanged:', greska);
        } finally {
          setUcitava(false);
        }
      });

      return unsubscribe;
    } catch (greska) {
      console.error('Greška pri inicijalizaciji onAuthStateChanged:', greska);
      setUcitava(false);
    }
  }, []);

  const prijava = async (email: string, lozinka: string) => {
    if (!auth) {
      throw new Error('Firebase Auth nije inicijalizovan');
    }
    await signInWithEmailAndPassword(auth, email, lozinka);
  };

  const registracija = async (email: string, lozinka: string, ime: string) => {
    if (!auth) {
      throw new Error('Firebase Auth nije inicijalizovan');
    }
    const korisnickiKredencijali = await createUserWithEmailAndPassword(auth, email, lozinka);
    const noviKorisnik = korisnickiKredencijali.user;
    
    // Kreiraj korisničke podatke u Firestore
    const podaci: KorisnickiPodaci = {
      uid: noviKorisnik.uid,
      email: noviKorisnik.email!,
      uloga: 'korisnik',
      ime,
      omiljeniProizvodi: [],
      istorijaPorudzbina: [],
    };
    
    await setDoc(doc(db, 'users', noviKorisnik.uid), podaci);
    setKorisnickiPodaci(podaci);
  };

  const odjava = async () => {
    if (!auth) {
      throw new Error('Firebase Auth nije inicijalizovan');
    }
    await signOut(auth);
    await AsyncStorage.clear();
  };

  const azurirajKorisnickePodatke = async (podaci: Partial<KorisnickiPodaci>) => {
    if (!korisnik || !auth) return;
    
    const azuriraniPodaci = { ...korisnickiPodaci, ...podaci };
    await setDoc(doc(db, 'users', korisnik.uid), azuriraniPodaci, { merge: true });
    setKorisnickiPodaci(azuriraniPodaci as KorisnickiPodaci);
  };

  return (
    <AuthContext.Provider value={{ korisnik, korisnickiPodaci, ucitava, prijava, registracija, odjava, azurirajKorisnickePodatke }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartContextType {
  stavke: CartItem[];
  dodajUKorpu: (proizvod: Product, kolicina?: number) => void;
  ukloniIzKorpe: (idProizvoda: string) => void;
  azurirajKolicinu: (idProizvoda: string, kolicina: number) => void;
  ocistiKorpu: () => void;
  izracunajUkupno: () => number;
  izracunajBrojStavki: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stavke, setStavke] = useState<CartItem[]>([]);

  useEffect(() => {
    ucitajKorpu();
  }, []);

  useEffect(() => {
    sacuvajKorpu();
  }, [stavke]);

  const ucitajKorpu = async () => {
    try {
      const podaciKorpe = await AsyncStorage.getItem('korpa');
      if (podaciKorpe) {
        setStavke(JSON.parse(podaciKorpe));
      }
    } catch (greska) {
      console.error('Greška pri učitavanju korpe:', greska);
    }
  };

  const sacuvajKorpu = async () => {
    try {
      await AsyncStorage.setItem('korpa', JSON.stringify(stavke));
    } catch (greska) {
      console.error('Greška pri čuvanju korpe:', greska);
    }
  };

  const dodajUKorpu = (proizvod: Product, kolicina: number = 1) => {
    setStavke((prethodneStavke) => {
      const postojecaStavka = prethodneStavke.find((stavka) => stavka.product.id === proizvod.id);
      if (postojecaStavka) {
        return prethodneStavke.map((stavka) =>
          stavka.product.id === proizvod.id
            ? { ...stavka, quantity: stavka.quantity + kolicina }
            : stavka
        );
      }
      return [...prethodneStavke, { product: proizvod, quantity: kolicina }];
    });
  };

  const ukloniIzKorpe = (idProizvoda: string) => {
    setStavke((prethodneStavke) => prethodneStavke.filter((stavka) => stavka.product.id !== idProizvoda));
  };

  const azurirajKolicinu = (idProizvoda: string, kolicina: number) => {
    if (kolicina <= 0) {
      ukloniIzKorpe(idProizvoda);
      return;
    }
    setStavke((prethodneStavke) =>
      prethodneStavke.map((stavka) =>
        stavka.product.id === idProizvoda ? { ...stavka, quantity: kolicina } : stavka
      )
    );
  };

  const ocistiKorpu = () => {
    setStavke([]);
  };

  const izracunajUkupno = () => {
    return stavke.reduce((ukupno, stavka) => ukupno + stavka.product.price * stavka.quantity, 0);
  };

  const izracunajBrojStavki = () => {
    return stavke.reduce((broj, stavka) => broj + stavka.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        stavke,
        dodajUKorpu,
        ukloniIzKorpe,
        azurirajKolicinu,
        ocistiKorpu,
        izracunajUkupno,
        izracunajBrojStavki,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

import axios from 'axios';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

interface ProductFromList {
  id: number;
  title: string;
  price: number;
  image: string;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // TODO
      let foundProduct:any = cart.find(product => product.id === productId)
      if(foundProduct === undefined){
        axios.get('http://localhost:3333/products')
        .then(response => response.data )
        .then(response=> {
          let found =  false;
          response.forEach( (e:Product) => {
            if(e.id == productId){
              found = true;
              return e
            }
          })
          if(!found)throw new Error('Erro na adição do produto');
        })
        .catch(e => toast.error(e.message)) 
      }else{
        let stock:any 
        stock = axios.get('http://localhost:3333/stock')
                .then(response => response.data )
                .then(stockArray => stockArray.find(
                    (product:UpdateProductAmount) => product.productId === productId))
                .then(product => {
                  if(product === undefined)throw new Error('Erro na adição do produto');
                  if(foundProduct.amount+1 > product.amount)throw new Error('Quantidade solicitada fora de estoque');

                })
          
      }
    } catch(e) {
      // TODO
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}

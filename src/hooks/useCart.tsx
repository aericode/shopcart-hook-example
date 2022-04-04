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
      let foundProduct:(Product|undefined) = cart.find(product => product.id === productId)
      if(foundProduct === undefined){
        axios.get('http://localhost:3333/products')
        .then(response => response.data )
        .then(response=> {
          let found =  false;
          let productToAdd:Product;
          response.forEach( (e:Product) => {
            if(e.id == productId){
              found = true;
              productToAdd = e
              productToAdd.amount = 1;
              const updatedCart = [...cart, productToAdd]
              localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));
              setCart(updatedCart)
            }
          })
          if(!found)throw new Error('Erro na adição do produto');
        })
        .catch(e => toast.error(e.message)) 
      }else{
        axios.get('http://localhost:3333/stock')
                .then(response => response.data )
                .then(function(stockArray:any){
                    const found = stockArray.find(
                    (product:any) => product.id == productId)
                    return found;
                  })
                .then(productInStock => {
                  
                  if(productInStock === undefined)throw new Error('Erro na adição do produto');
                  if(foundProduct !== undefined)
                  if(foundProduct.amount+1 > productInStock.amount)throw new Error('Quantidade solicitada fora de estoque');
                  const updatedCart = cart.map((product:any) => 
                    (product.id === productId)?{...product, amount: product.amount+1}:product) 
                  setCart(updatedCart)
                  localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));
                  
                })
                .catch(e => toast.error(e.message))
          
      }
    } catch(e) {
      // TODO
      toast.error("erro inesperado")
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      const foundProduct:(Product|undefined) = cart.find(product => product.id === productId)
      if(foundProduct === undefined)throw new Error();
      if(foundProduct!== undefined)
      if(foundProduct.amount === 0)throw new Error();
      let updatedCart = cart.map((product:any) => 
        (product.id === productId)?{...product, amount: product.amount-1}:product)
      updatedCart = updatedCart.filter((product:any) => product.amount !== 0)
      setCart(updatedCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));
    } catch {
      toast.error('Erro na remoção do produto');
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

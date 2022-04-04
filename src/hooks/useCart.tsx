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
    console.log("atualizando carrinho")
    const storagedCart = localStorage.getItem('@RocketShoes:cart');
    console.log('ó o carrinho', storagedCart)

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }


    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // TODO

      console.log("will find product on list", productId)
      let foundProduct:(Product|undefined) = cart.find(product => product.id === productId)
      console.log('look what i\'ve found!', foundProduct)
      if(foundProduct === undefined){
        console.log("new product to cart")
        axios.get('http://localhost:3333/products')
        .then(response => response.data )
        .then(response=> {
          let found =  false;
          let productToAdd:Product;
          response.forEach( (e:Product) => {
            if(e.id == productId){
              found = true;
              console.log('testando 3', e)
              productToAdd = e
              productToAdd.amount = 1;
              console.log(productToAdd)
              const updatedCart = [...cart, productToAdd]
              
              console.log('testando 4', updatedCart)
              localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));
              setCart(updatedCart)
              console.log("LOOK AT WHAT YOU DID TO CART!", cart)
              
            }
          })
          if(!found)throw new Error('Erro na adição do produto');
        })
        .catch(e => toast.error(e.message)) 
      }else{
        console.log("existing product on cart, updating...")
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
                    (product.id === productId)?{...product, amount: product.amount+1}:product
                  )
                  setCart(updatedCart)
                  console.log('testando', JSON.stringify(updatedCart))
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

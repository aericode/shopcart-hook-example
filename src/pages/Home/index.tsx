import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';


import axios from 'axios';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount: CartItemsAmount, product:Product) => {
     //TODO
     sumAmount[product.id] = product.amount
     return sumAmount;
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      // TODO      
      axios.get('http://localhost:3333/products')
      .then(
        response => response.data
      )
      .then(
        data => {data.forEach(function(element:ProductFormatted){
              element.priceFormatted = formatPrice(element.price)
            }
          )
          return data;
        }
      )
      .then(formattedData => setProducts(formattedData))
      .catch(function(error){
        console.log(error)
      })      
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    // TODO
    console.log(id)
    addProduct(id)
  }


  return (  
    <ProductList>
      {products.map(function(product){
        return(
        <li key={product.id}>
            <img src={product.image} />
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>
            <button
              type="button"
              data-testid="add-product-button"
              onClick={() => handleAddProduct(product.id)}
            >
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {cartItemsAmount[product.id] || 0}
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
          )
        })
      }
    </ProductList>
    
    
  );
};

export default Home;

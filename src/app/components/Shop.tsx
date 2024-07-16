"use client";

import { useState } from 'react';
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';
import { useApolloClient } from '@apollo/client';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  type: string;
  quantity: number;
}

const products: Product[] = [
  { id: '1', name: 'The Lord of the Rings', price: 10, image: '/images/book1.webp', type: 'book', quantity: 1 },
  { id: '2', name: 'Harry Potter and the Chamber of Secrets (Illustrated Edition)', price: 15, image: '/images/book2.webp', type: 'book', quantity: 1 },
  { id: '3', name: 'Harry Potter and the Chamber of Secrets', price: 20, image: '/images/book3.webp', type: 'book', quantity: 1 },
  { id: '4', name: 'Harry Potter and the Prisoner of Azkaban', price: 15, image: '/images/book4.webp', type: 'book', quantity: 1 },
  { id: '5', name: 'Harry Potter and the Deathly Hallows', price: 20, image: '/images/book5.webp', type: 'book', quantity: 1 },
  { id: '6', name: 'Harry Potter and the Goblet of Fire', price: 15, image: '/images/book6.webp', type: 'book', quantity: 1 },
  { id: '7', name: 'The Witcher. 1. The Last Wish', price: 20, image: '/images/book7.webp', type: 'book', quantity: 1 },
  { id: '8', name: 'The Witcher. 4. Time of Contempt', price: 15, image: '/images/book8.webp', type: 'book', quantity: 1 },
  { id: '9', name: 'The Witcher. 6. The Tower of the Swallow', price: 20, image: '/images/book9.webp', type: 'book', quantity: 1 },
];

const ADD_TO_CART = gql`
  mutation AddToCart($id: ID!, $name: String!, $price: Float!, $quantity: Int!) {
    addToCart(id: $id, name: $name, price: $price, quantity: $quantity) {
      id
      name
      price
      quantity
    }
  }
`;

export default function Shop() {
  const [cart, setCart] = useState<Product[]>([]);
  const [addToCart] = useMutation(ADD_TO_CART);
  const client = useApolloClient();

  const handleAddToCart = async (product: Product) => {
    try {
      const { data } = await addToCart({
        variables: { id: product.id, name: product.name, price: product.price, quantity: 1 },
      });
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === data.addToCart.id);
        if (existingItem) {
          return prevCart.map(item =>
            item.id === data.addToCart.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prevCart, data.addToCart];
        }
      });
      await client.refetchQueries({
        include: ["GetCart"],
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl text-blue-600 font-bold">Shop</h1>
        <Link href="/checkout">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg from-emerald-500 to-sky-500 bg-gradient-to-b p-4 flex flex-col items-center relative"
            style={{ height: '100%' }}
          >
            <div className="bg-white rounded-lg p-1 w-full flex justify-center items-center">
              <img src={product.image} alt={product.name} className="object-contain h-60 w-full" />
            </div>
            <div className="flex flex-col items-center text-center space-y-2 flex-1 justify-between w-full">
              <div>
                <h2 className="text-xl font-semibold text-white">{product.name}</h2>
                <p className="text-gray-200">${product.price}</p>
              </div>
              <button
                className="mt-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

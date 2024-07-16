"use client";

import { useState, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import OrderConfirmation from './OrderConfirmation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const GET_CART = gql`
  query GetCart {
    cart {
      id
      name
      price
      quantity
    }
  }
`;

const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const UPDATE_QUANTITY = gql`
  mutation UpdateQuantity($id: ID!, $quantity: Int!) {
    updateQuantity(id: $id, quantity: $quantity) {
      id
      quantity
    }
  }
`;

const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart {
      id
    }
  }
`;

export default function Cart() {
  const { data, loading, error, refetch } = useQuery(GET_CART);
  const [cart, setCart] = useState<CartItem[] | null>(null);

  useEffect(() => {
    if (data && data.cart) {
      setCart(data.cart);
    }
  }, [data]);

  // Refetch cart items after initial load
  useEffect(() => {
    refetch();
  }, []);

  const [removeFromCart] = useMutation(REMOVE_FROM_CART, {
    onCompleted: (data) => {
      if (data && data.removeFromCart) {
        setCart(prevCart => prevCart ? prevCart.filter(item => item.id !== data.removeFromCart.id) : null);
        refetch();
      }
    },
    onError: (error) => {
      console.error('Error in removeFromCart mutation:', error);
    },
  });

  const [updateQuantity] = useMutation(UPDATE_QUANTITY, {
    onCompleted: (data) => {
      if (data && data.updateQuantity) {
        setCart(prevCart => prevCart ? prevCart.map(item => (item.id === data.updateQuantity.id ? { ...item, quantity: data.updateQuantity.quantity } : item)) : null);
        refetch();
      }
    },
    onError: (error) => {
      console.error('Error in updateQuantity mutation:', error);
    },
  });

  const [clearCart] = useMutation(CLEAR_CART, {
    onCompleted: () => {
      setCart([]);
      refetch();
    },
    onError: (error) => {
      console.error('Error in clearCart mutation:', error);
    },
  });

  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  const handleRemoveFromCart = (id: string) => {
    removeFromCart({ variables: { id } });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return;
    updateQuantity({ variables: { id, quantity } });
  };

  const handleConfirmOrder = () => {
    setIsOrderConfirmed(true);
    clearCart();
  };

  const handleAnimationComplete = () => {
    setShowMessage(true);
    setIsOrderConfirmed(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const handleProcessPayment = () => {
    setIsPaymentProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setIsPaymentSuccessful(true);
    }, 2000);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading cart data.</div>;

  const totalPrice = cart?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  if (isOrderConfirmed) {
    return <OrderConfirmation onAnimationComplete={handleAnimationComplete} />;
  }

  if (isPaymentSuccessful) {
    handleConfirmOrder();
  }

  return (
    <div className="relative max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      {showMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Our operator will contact you soon!</h1>
            <Link href="/">
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setShowMessage(false)}
              >
                Return to Shop
              </button>
            </Link>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-semibold mb-4 text-black">Cart</h1>
      <ul className="space-y-4">
        {cart?.map(item => (
          <li key={item.id} className="flex justify-between items-center border-b pb-2">
            <div className="text-black">
              <p className="text-lg font-medium">{item.name} - ${item.price} x {item.quantity}</p>
              <p className="text-sm text-gray-600">Total: ${item.price * item.quantity}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleRemoveFromCart(item.id)}
              >
                <Trash2 size={16} />
              </button>
              <button 
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
              <button 
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
              >
                -
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-black">Total: ${totalPrice}</h2>
        <form className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={customerDetails.name}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={customerDetails.email}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={customerDetails.address}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={customerDetails.city}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={customerDetails.state}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Zip Code</label>
            <input
              type="text"
              name="zip"
              value={customerDetails.zip}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </form>
        <h2 className="text-xl font-semibold mt-6 text-black">Payment Details</h2>
        <form className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={handlePaymentInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
            <input
              type="text"
              name="expirationDate"
              value={paymentDetails.expirationDate}
              onChange={handlePaymentInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CVV</label>
            <input
              type="text"
              name="cvv"
              value={paymentDetails.cvv}
              onChange={handlePaymentInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </form>
        <div className="flex justify-center">
          <button 
            className="mt-4 w-1/2 md:w-1/3 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleProcessPayment}
            disabled={isPaymentProcessing}
          >
            {isPaymentProcessing ? 'Processing...' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

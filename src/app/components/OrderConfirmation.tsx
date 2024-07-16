"use client";

import { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import animationData from '../../../public/animation.json'; // Update with your actual path

const OrderConfirmation = ({ onAnimationComplete }: { onAnimationComplete: () => void }) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    if (isAnimationComplete) {
      const timer = setTimeout(onAnimationComplete, 2000); // Show message for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isAnimationComplete, onAnimationComplete]);

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      {!isAnimationComplete ? (
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
          eventListeners={[
            {
              eventName: 'complete',
              callback: () => setIsAnimationComplete(true),
            },
          ]}
        />
      ) : (
        <div className="text-center">
          <h1 className="text-2xl text-blue-600 font-bold">Our operator will contact you soon!</h1>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;

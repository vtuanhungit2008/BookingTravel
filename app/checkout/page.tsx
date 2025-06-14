'use client';

import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

function CheckoutPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  
  const fetchClientSecret = useCallback(async () => {
    if (!bookingId) return null;
  
    
    const response = await axios.post('/api/payment', {
      bookingId,
    });
    
    return response.data.clientSecret;
  }, [bookingId]);

  if (!bookingId) {
    return <p className="text-center mt-10">Không tìm thấy mã đặt phòng.</p>;
  }

  const options = { fetchClientSecret };

  return (
    <div id="checkout" className="min-h-screen flex justify-center items-center">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

export default CheckoutPage;

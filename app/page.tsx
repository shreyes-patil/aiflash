'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@/components/custom/Card';
import { useRouter } from 'next/navigation';
import  getStripe  from '../utils/get-stripe';



const Page = () => {
  const handleProSubscribe = () => {
    alert("Subscribed to Pro");
  };

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: "POST",
      headers: {
        origin: 'http://localhost:3000/'
      }
    });

    if (checkoutSession.status === 500) {
      const errorResponse = await checkoutSession.json();
      console.error(errorResponse.message);
      return;
    }

    const checkoutSessionJson = await checkoutSession.json();
    const stripe = await getStripe();
    const error = await stripe?.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    });

    if (error) {
      console.warn(error.message);
    }
  };

  const router = useRouter();

  return (
    <div className='w-full'>

      <Box className="text-center">
        <Typography variant="h2">Welcome to AIFlash</Typography>
        <Typography variant="h5">Generate Flash cards with AI</Typography>

        <Button onClick={() => {
          router.push('/generate');
        }} className="bg-blue-700 text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4">
          Generate Now
        </Button>
      </Box>

      <div className="flex flex-row justify-around">
        <Card
          title="Basic"
          points={["1 AI generated card", "1 AI generated card", "1 AI generated card"]}
          buttons={[{ name: "Subscribe", btnOnClick:handleSubmit }]}
        />

        <Card
          title="Pro"
          points={["1 AI generated card", "1 AI generated card", "1 AI generated card"]}
          buttons={[{ name: "Subscribe", btnOnClick: handleSubmit }]}
        />
      </div>
    </div>
  );
};

export default Page;

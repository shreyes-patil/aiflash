'use client'
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@/components/custom/Card';
import { useRouter } from 'next/navigation';

const Page = () => {
  const handleProSubscribe = () => {
    // Your subscription logic here
    alert("Subscribed to Pro");
  };

  const router = useRouter();

  return (
    <div className='w-full'>

      <Box className="text-center">
        <Typography variant="h2"> Welcome to AIFlash</Typography>
        <Typography variant="h5"> Generate Flash cards with AI</Typography>

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
          buttons={[{ name: "Subscribe", btnOnClick: () => {
            alert("Subscribed to Basic");
          } }]}
        />

        <Card
          title="Pro"
          points={["1 AI generated card", "1 AI generated card", "1 AI generated card"]}
          buttons={[{ name: "Subscribe", btnOnClick: handleProSubscribe }]}
        />
      </div>
    </div>
  );
};

export default Page;
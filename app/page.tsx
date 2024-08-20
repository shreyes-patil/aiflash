'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import getStripe from '../utils/get-stripe';

const Page = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl font-bold mb-4">Welcome to AIFlash</h1>
        <p className="text-xl mb-8">Generate Flash cards with AI</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/generate')}
          className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-100 transition duration-300"
        >
          Generate Now
        </motion.button>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
        <PricingCard
          title="Basic"
          price="$9.99"
          features={[
            "100 AI generated cards per month",
            "Basic customization options",
            "24/7 customer support"
          ]}
          onSubscribe={handleSubmit}
        />
        <PricingCard
          title="Pro"
          price="$19.99"
          features={[
            "Unlimited AI generated cards",
            "Advanced customization options",
            "Priority customer support",
            "Exclusive templates"
          ]}
          onSubscribe={handleSubmit}
          isPro
        />
      </div>
    </div>
  );
};

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  onSubscribe: () => void;
  isPro?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, features, onSubscribe, isPro = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: isPro ? 0.2 : 0 }}
    className={`bg-white text-gray-800 rounded-lg shadow-xl p-8 w-full max-w-sm ${
      isPro ? 'border-4 border-yellow-400' : ''
    }`}
  >
    <h2 className="text-3xl font-bold mb-4">{title}</h2>
    <p className="text-4xl font-bold mb-6">{price}<span className="text-lg">/month</span></p>
    <ul className="mb-8">
      {features.map((feature: string, index: number) => (
        <li key={index} className="flex items-center mb-2">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSubscribe}
      className={`w-full py-3 rounded-full font-bold ${
        isPro
          ? 'bg-yellow-400 text-gray-800 hover:bg-yellow-500'
          : 'bg-purple-600 text-white hover:bg-purple-700'
      } transition duration-300`}
    >
      Subscribe Now
    </motion.button>
  </motion.div>
);
export default Page;
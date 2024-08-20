import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

// Efficiently loads Stripe only once, loads only when stripePromise is undefined/null
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export default getStripe;

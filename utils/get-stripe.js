
import {loadStripe} from '@stripe/stripe-js'


let stripePromise

// efficiently loads stripe only once, loads only when stripePromise is undefined/nan/null

const getStripe = () => {
    if(!stripePromise){
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
}
return StripePromise
}


export default getStripe;
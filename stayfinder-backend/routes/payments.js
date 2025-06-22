// Example: routes/payments.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');

router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // amount in rupees
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects paise
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, details: err });
  }
});

module.exports = router;
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('.'));
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const { token } = req.body;
  console.log('Received token:', token);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // This amount is in cents, equivalent to $10.00
      currency: 'usd',
      payment_method_types: ['card'], // Use the 'card' payment method type
      payment_method: token, // Use the token from the client
      confirm: true,
    });

    console.log('Created Payment Intent:', paymentIntent);
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating Payment Intent:', error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('.'));
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const { token } = req.body;
  console.log('Received token:', token); // Add this line

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Replace with your actual amount
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      payment_method: token, // Use the token from the client
      confirm: true, // Automatically confirm the Payment Intent
    });

    console.log('Created Payment Intent:', paymentIntent); // Add this line
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating Payment Intent:', error); // Add this line
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

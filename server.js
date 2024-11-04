const express = require('express');
const app = express();
const stripe = require('stripe')('your-secret-key-here'); // Replace with your actual Stripe secret key
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

// Endpoint to create a Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    // Retrieve data sent from the frontend
    const { customerName, customerEmail, estimateNumber } = req.body;

    // Create a Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Replace with actual calculation or fixed amount (e.g., in cents)
      currency: 'usd',
      metadata: { customerName, customerEmail, estimateNumber },
    });

    // Send the clientSecret back to the client
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating Payment Intent:', error);
    res.status(500).json({ error: 'Failed to create Payment Intent' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

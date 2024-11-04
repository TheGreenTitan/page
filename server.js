// Prevent duplicate customers by reusing existing customers with the same estimateNumber
// Monday, November 4, 2024, 12:12 AM CST

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('.'));
app.use(express.json());

app.post('/create-payment', async (req, res) => {
  const { token, name, email, phone, estimateNumber } = req.body;

  try {
    // Search for an existing customer with the same estimateNumber in the metadata
    const existingCustomers = await stripe.customers.list({
      metadata: { estimateNumber: estimateNumber },
    });
    
    // End of code to prevent duplicate customers
    // Monday, November 4, 2024, 12:12 AM CST

    let customer;
    if (existingCustomers.data.length > 0) {
      // Reuse the existing customer
      customer = existingCustomers.data[0];
      console.log('Reusing existing customer:', customer.id);
    } else {
      // Create a new customer
      customer = await stripe.customers.create({
        name: name,
        email: email,
        phone: phone,
        metadata: { estimateNumber: estimateNumber },
      });
      console.log('Created new customer:', customer.id);
    }

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: { token: token },
    });

    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // $50 deposit
      currency: 'usd',
      customer: customer.id,
      payment_method_data: { type: 'card', card: { token: token } }, // Corrected parameter
      confirm: true,
    });

    console.log('Payment Intent created:', paymentIntent);
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating Payment Intent:', error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

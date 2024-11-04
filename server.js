const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('.'));
app.use(express.json());

app.post('/create-payment', async (req, res) => {
  const { token, name, email, phone, estimateNumber } = req.body;

  try {
    const customer = await stripe.customers.create({
      name: name,
      email: email,
      phone: phone,
      metadata: { estimateNumber: estimateNumber },
    });

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
      payment_method_data: { type: 'card', card: { token: token } },
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

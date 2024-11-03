const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Add this line
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

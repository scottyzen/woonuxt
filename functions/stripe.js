const stripe = require('stripe')('sk_test_51KoqfeLqZEQtkS6nsr2zulvLqgTfgozVLzNFGpc2NPPEdCMbd2ZXL1QaPGLHc0PyhZ3SbLN8D9RWouiHz6VwX6l300HHCwEO1h');

exports.handler = async (event, context) => {
  const { email, amount, currency } = JSON.parse(event.body);
  console.log({ email, amount, currency });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount),
      currency: currency || 'usd',
      payment_method_types: ['card'],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ...paymentIntent }),
    };
  } catch (error) {
    console.log(error);
  }
};

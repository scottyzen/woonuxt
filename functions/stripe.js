const stripe = require('stripe')('sk_test_51KoqfeLqZEQtkS6nsr2zulvLqgTfgozVLzNFGpc2NPPEdCMbd2ZXL1QaPGLHc0PyhZ3SbLN8D9RWouiHz6VwX6l300HHCwEO1h');

exports.handler = async (event, context) => {
  console.log('LAMBDA FUNCTION RAN', event, context);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'usd',
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ ...paymentIntent }),
    };
  } catch (error) {
    console.log(error);
  }
};

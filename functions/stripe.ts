const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event: any, context: any) => {
  const { amount, currency } = JSON.parse(event.body);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount),
      currency: currency || 'eur',
      payment_method_types: ['card'],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ...paymentIntent }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};

let _stripe = null;

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!_stripe) _stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}

exports.createIntent = async ({ amountAud, metadata }) => {
  const stripe = getStripe();
  if (!stripe) throw new Error('Stripe not configured');
  return stripe.paymentIntents.create({
    amount: Math.round(amountAud * 100),
    currency: 'aud',
    metadata,
    automatic_payment_methods: { enabled: true },
  });
};

exports.retrieveIntent = async (id) => {
  const stripe = getStripe();
  if (!stripe) throw new Error('Stripe not configured');
  return stripe.paymentIntents.retrieve(id);
};

exports.isConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

import type { PaymentGatewayPlugin } from '#types/payment-gateway-plugin';

export const paypalGatewayPlugin: PaymentGatewayPlugin = {
  id: 'paypal',
  name: 'PayPal',
  icon: '/icons/payment/paypal.svg',
};

export const ppcpGatewayPlugin: PaymentGatewayPlugin = {
  id: 'ppcp-gateway',
  name: 'PayPal Payments',
  icon: '/icons/payment/paypal.svg',
};

export default defineNuxtPlugin(() => {
  const { registerGateway } = usePaymentGateways();
  registerGateway(paypalGatewayPlugin);
  registerGateway(ppcpGatewayPlugin);
});

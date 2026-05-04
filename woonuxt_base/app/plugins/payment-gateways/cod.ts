import type { PaymentGatewayPlugin } from '#types/payment-gateway-plugin';

export const codGatewayPlugin: PaymentGatewayPlugin = {
  id: 'cod',
  name: 'Cash on delivery',
  iconName: 'ion:cash-outline',
};

export default defineNuxtPlugin(() => {
  const { registerGateway } = usePaymentGateways();
  registerGateway(codGatewayPlugin);
});

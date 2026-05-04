import type { PaymentGatewayPlugin } from '#types/payment-gateway-plugin';

export const chequeGatewayPlugin: PaymentGatewayPlugin = {
  id: 'cheque',
  name: 'Cheque payments',
  iconName: 'ion:document-text-outline',
};

export default defineNuxtPlugin(() => {
  const { registerGateway } = usePaymentGateways();
  registerGateway(chequeGatewayPlugin);
});

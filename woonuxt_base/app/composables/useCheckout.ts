import type { CheckoutInput, UpdateCustomerInput, CreateAccountInput } from '#gql';

export function useCheckout() {
  const orderInput = useState<any>('orderInput', () => {
    return {
      customerNote: '',
      paymentMethod: '',
      shipToDifferentAddress: false,
      metaData: [{ key: 'order_via', value: 'WooNuxt' }],
    };
  });

  const isProcessing = useState<boolean>('isProcessing', () => false);

  // if Country or State are changed, calculate the shipping rates again
  async function updateShippingLocation() {
    const { customer, viewer } = useAuth();
    const { isUpdatingCart, refreshCart } = useCart();

    isUpdatingCart.value = true;

    try {
      const { updateCustomer } = await GqlUpdateCustomer({
        input: {
          id: viewer?.value?.id,
          shipping: orderInput.value.shipToDifferentAddress ? customer.value.shipping : customer.value.billing,
          billing: customer.value.billing,
        } as UpdateCustomerInput,
      });

      if (updateCustomer) refreshCart();
    } catch (error) {
      console.error(error);
    }
  }

  function openPayPalWindow(redirectUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      const width = 750;
      const height = 750;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2 + 80;
      const payPalWindow = window.open(redirectUrl, '', `width=${width},height=${height},top=${top},left=${left}`);
      const timer = setInterval(() => {
        if (payPalWindow?.closed) {
          clearInterval(timer);
          resolve(true);
        }
      }, 500);
    });
  }

  const proccessCheckout = async (isPaid = false) => {
    const { loginUser } = useAuth();
    const router = useRouter();
    const { emptyCart, refreshCart } = useCart();
    const { customer } = useAuth();

    try {
      isProcessing.value = true;
      
      if (!orderInput.value?.paymentMethod?.id) {
        throw new Error('Payment method not selected');
      }

      const checkoutPayload = {
        billing: customer.value?.billing || {},
        shipping: orderInput.value.shipToDifferentAddress ? customer.value?.shipping : customer.value?.billing,
        metaData: orderInput.value.metaData,
        paymentMethod: orderInput.value.paymentMethod.id,
        customerNote: orderInput.value.customerNote,
        shipToDifferentAddress: orderInput.value.shipToDifferentAddress,
        transactionId: orderInput.value.transactionId,
        isPaid
      };

      const { checkout } = await GqlCheckout(checkoutPayload);
      
      const orderId = checkout?.order?.databaseId;
      const orderKey = checkout?.order?.orderKey;
      const isBtcPay = orderInput.value.paymentMethod.id === 'btcpay';

      if (!orderId || !orderKey) {
        throw new Error('Invalid order response');
      }

      if (isBtcPay) {
        console.log('BTCPay checkout - redirecting to payment page');
        // Don't empty cart yet for BTCPay
        await router.push({
          path: `/checkout/btcpay`,
          query: { 
            order_id: orderId,
            key: orderKey
          }
        });
        return;
      }

      // For non-BTCPay methods
      if (checkout?.result === 'success') {
        console.log('Checkout successful, emptying cart');
        await emptyCart();
        await refreshCart();
        await router.push(`/checkout/order-received/${orderId}/?key=${orderKey}`);
      } else {
        throw new Error(checkout?.result || 'Checkout failed');
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      isProcessing.value = false;
      alert(error?.gqlErrors?.[0]?.message || error.message || 'Checkout failed');
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    orderInput,
    isProcessing,
    proccessCheckout,
    updateShippingLocation,
  };
}

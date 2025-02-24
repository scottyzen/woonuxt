import type { CheckoutInput, UpdateCustomerInput, CreateAccountInput } from '#gql';

export function useCheckout() {
  const orderInput = useState<any>('orderInput', () => ({
    customerNote: '',
    paymentMethod: '',
    shipToDifferentAddress: false,
    metaData: [{ key: 'order_via', value: 'WooNuxt' }],
    createAccount: false,
    username: '',
    password: '',
    transactionId: ''
  }));

  const isProcessingOrder = useState<boolean>('isProcessingOrder', () => false);

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
    const { replaceQueryParam } = useHelpers();
    const { emptyCart, refreshCart } = useCart();
    const { customer } = useAuth();

    try {
      isProcessingOrder.value = true;
      
      // Validate required data
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

      // Create account
      if (orderInput.value.createAccount) {
        checkoutPayload.account = { username: orderInput.value.username, password: orderInput.value.password } as CreateAccountInput;
      }

      const { checkout } = await GqlCheckout(checkoutPayload);

      // Login user if account was created during checkout
      if (orderInput.value.createAccount) {
        await loginUser({ username: orderInput.value.username, password: orderInput.value.password });
      }

      const orderId = checkout?.order?.databaseId;
      const orderKey = checkout?.order?.orderKey;
      const isPayPal = orderInput.value.paymentMethod.id === 'paypal';
      const isBtcPay = orderInput.value.paymentMethod.id === 'btcpay';

      // PayPal redirect
      if ((await checkout?.redirect) && isPayPal) {
        const frontEndUrl = window.location.origin;
        let redirectUrl = checkout?.redirect ?? '';

        const payPalReturnUrl = `${frontEndUrl}/checkout/order-received/${orderId}/?key=${orderKey}&from_paypal=true`;
        const payPalCancelUrl = `${frontEndUrl}/checkout/?cancel_order=true&from_paypal=true`;

        redirectUrl = replaceQueryParam('return', payPalReturnUrl, redirectUrl);
        redirectUrl = replaceQueryParam('cancel_return', payPalCancelUrl, redirectUrl);
        redirectUrl = replaceQueryParam('bn', 'WooNuxt_Cart', redirectUrl);

        const isPayPalWindowClosed = await openPayPalWindow(redirectUrl);

        console.log('Payment method:', orderInput.value.paymentMethod.id);
        if (isPayPalWindowClosed) {
          console.log('PayPal window closed, redirecting to order received');
          router.push(`/checkout/order-received/${orderId}/?key=${orderKey}&fetch_delay=true`);
        }
      } else if ((await checkout?.redirect) && isBtcPay) {
        // BTCPay Redirect
        console.log('Processing BTCPay checkout');
        console.log('Redirecting to:', redirectUrl);
        router.push(`/checkout/btcpay?order_id=${orderId}&key=${orderKey}`);
      } else {
        console.log('Standard redirect to order received');
        router.push(`/checkout/order-received/${orderId}/?key=${orderKey}`);
      }

      if ((await checkout?.result) !== 'success') {
        console.log('Checkout failed:', await checkout?.result);
        alert('There was an error processing your order. Please try again.');
        window.location.reload();
        return checkout;
      } else {
        console.log('Checkout successful, emptying cart');
        await emptyCart();
        await refreshCart();
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      isProcessingOrder.value = false;

      const errorMessage = error?.gqlErrors?.[0].message;

      if (errorMessage?.includes('An account is already registered with your email address')) {
        alert('An account is already registered with your email address');
        return null;
      }

      alert(errorMessage);
      return null;
    }

    isProcessingOrder.value = false;
  };

  return {
    orderInput,
    isProcessingOrder,
    proccessCheckout,
    updateShippingLocation,
  };
}

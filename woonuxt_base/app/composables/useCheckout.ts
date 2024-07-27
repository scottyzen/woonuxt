import type { CheckoutInput, UpdateCustomerInput, CreateAccountInput } from '#gql';
import type { Stripe, StripeElements } from '@stripe/stripe-js';

export function useCheckout() {
  const { t } = useI18n();
  const orderInput = useState<any>('orderInput', () => {
    return {
      customerNote: '',
      paymentMethod: '',
      shipToDifferentAddress: false,
      metaData: [{ key: 'order_via', value: 'WooNuxt' }],
    };
  });

  onMounted(() => {
    const savedOrderInput = localStorage.getItem('WooNuxtOrderInput');
    if (savedOrderInput) {
      orderInput.value = JSON.parse(savedOrderInput);
    }
  });

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
    const { customer, loginUser } = useAuth();
    const router = useRouter();
    const { replaceQueryParam } = useHelpers();
    const { emptyCart, refreshCart } = useCart();

    isProcessingOrder.value = true;

    const { username, password, shipToDifferentAddress } = orderInput.value;
    const billing = customer.value?.billing;
    const shipping = shipToDifferentAddress ? customer.value?.shipping : billing;

    try {
      let checkoutPayload: CheckoutInput = {
        billing,
        shipping,
        metaData: orderInput.value.metaData,
        paymentMethod: orderInput.value.paymentMethod.id,
        customerNote: orderInput.value.customerNote,
        shipToDifferentAddress,
        transactionId: orderInput.value.transactionId,
        isPaid,
      };

      // Create account
      if (orderInput.value.createAccount) {
        checkoutPayload.account = { username, password } as CreateAccountInput;
      }

      const { checkout } = await GqlCheckout(checkoutPayload);

      // Login user if account was created during checkout
      if (orderInput.value.createAccount) {
        await loginUser({ username, password });
      }

      const orderId = checkout?.order?.databaseId;
      const orderKey = checkout?.order?.orderKey;
      const paymentMethodId = orderInput.value.paymentMethod.id;
      const isPayPal = paymentMethodId === 'paypal' || paymentMethodId === 'ppcp-gateway';

      // PayPal redirect
      if (checkout?.redirect && isPayPal) {
        const frontEndUrl = window.location.origin;
        let redirectUrl = checkout?.redirect ?? '';

        const payPalReturnUrl = `${frontEndUrl}/checkout/order-received/${orderId}/?key=${orderKey}&from_paypal=true`;
        const payPalCancelUrl = `${frontEndUrl}/checkout/?cancel_order=true&from_paypal=true`;

        redirectUrl = replaceQueryParam('return', payPalReturnUrl, redirectUrl);
        redirectUrl = replaceQueryParam('cancel_return', payPalCancelUrl, redirectUrl);
        redirectUrl = replaceQueryParam('bn', 'WooNuxt_Cart', redirectUrl);

        const isPayPalWindowClosed = await openPayPalWindow(redirectUrl);

        if (isPayPalWindowClosed) {
          router.push(`/checkout/order-received/${orderId}/?key=${orderKey}&fetch_delay=true`);
        }
      } else {
        router.push(`/checkout/order-received/${orderId}/?key=${orderKey}`);
      }

      if (checkout?.result !== 'success') {
        alert(t('messages.error.orderFailed'));
        window.location.reload();
      } else {
        await emptyCart();
        await refreshCart();
      }
    } catch (error: any) {
      const errorMessage = error?.gqlErrors?.[0].message;

      if (errorMessage?.includes('An account is already registered with your email address')) {
        alert('An account is already registered with your email address');
      } else {
        alert(errorMessage);
      }
    } finally {
      manageCheckoutLocalStorage(false);
      isProcessingOrder.value = false;
    }
  };

  const stripePaymentCheckout = async (stripe: Stripe, elements: StripeElements) => {

    const { error: submitError } = await elements.submit();
    if (submitError) {
      throw new Error(submitError.message);
    }

    const { stripePaymentIntent } = await GqlGetStripePaymentIntent();
    const clientSecret = stripePaymentIntent?.clientSecret;
    if (!clientSecret) throw new Error('Stripe PaymentIntent client secret missing!');
    if (!stripePaymentIntent.id) throw new Error('Stripe PaymentIntent id missing!');

    orderInput.value.metaData.push({ key: '_stripe_intent_id', value: stripePaymentIntent.id });
    orderInput.value.transactionId = stripePaymentIntent.id;

    // Let's save checkout orderInput & customer to maintain state after redirect
    // We are not sure whether the confirmSetup will redirect if needed or continue code execution
    manageCheckoutLocalStorage(true);

    const confirmSetup = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
      },
      redirect: 'if_required',
    });

    if (confirmSetup.error) {
      throw new Error(confirmSetup.error.message);
    }

    if (confirmSetup.paymentIntent.status === 'succeeded') {
      proccessCheckout(true);
    }
  };

  const validateStripePaymentFromRedirect = async (stripe: Stripe, clientSecret: string, redirectStatus: string) => {
    const clear = () => {
      useRouter().push({ query: {} });
      manageCheckoutLocalStorage(false);
      alert(t('messages.error.orderFailed'));
    };

    if (redirectStatus !== 'succeeded') {
      clear();
      return;
    }
  
    isProcessingOrder.value = true;
    try {
      const paymentIntent = await stripe.retrievePaymentIntent(clientSecret);
      if (paymentIntent?.paymentIntent?.status === 'succeeded') {
        proccessCheckout(true);
      }
    } catch (error) {
      isProcessingOrder.value = false;
      console.error(error);
      clear();
    }
  };

  /**
   * Manages the local storage for checkout data, specifically saving and removing
   * the 'WooNuxtOrderInput' and 'WooNuxtCustomer' items. This is necessary to maintain
   * the state after a redirect, ensuring the orderInput and customer information persist.
   *
   * @param {boolean} shouldStore - Indicates whether to save or remove the data in local storage.
   */
  const manageCheckoutLocalStorage = (shouldStore: boolean) => {
    if (shouldStore) {
      localStorage.setItem('WooNuxtOrderInput', JSON.stringify(orderInput.value));
      localStorage.setItem('WooNuxtCustomer', JSON.stringify(useAuth().customer.value));
    } else {
      localStorage.removeItem('WooNuxtOrderInput');
      localStorage.removeItem('WooNuxtCustomer');
    }
  };

  return {
    orderInput,
    isProcessingOrder,
    stripePaymentCheckout,
    validateStripePaymentFromRedirect,
    proccessCheckout,
    updateShippingLocation,
  };
}

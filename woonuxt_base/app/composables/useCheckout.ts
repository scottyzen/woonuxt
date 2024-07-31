import type { CheckoutInput, UpdateCustomerInput, CreateAccountInput } from '#gql';
import { StripePaymentMethodEnum } from '#gql/default';
import type { CreateSourceData, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { CheckoutInlineError } from '../types/CheckoutInlineError';

export function useCheckout() {
  const { t } = useI18n();
  const { storeSettings } = useAppConfig();
  const errorMessage = useState<string | null>('errorMessage', () => null);
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

  const stripeCheckout = async (stripe: Stripe, elements: StripeElements) => {
    let isPaid: boolean;

    if (storeSettings.stripePaymentMethod === 'card') {
      isPaid = await stripeCardCheckout(stripe, elements);

    } else if (storeSettings.stripePaymentMethod === 'payment') {
      isPaid = await stripePaymentCheckout(stripe, elements);
    } else {
      throw new Error("Invalid storeSettings.stripePaymentMethod");
    }

    if (isPaid) {
      await proccessCheckout(true);
    } else {
      throw new Error(t('messages.error.orderFailed'));
    }
  }

  const stripeCardCheckout = async (stripe: Stripe, elements: StripeElements) => {
    const cardElement = elements.getElement('card') as StripeCardElement;
    const { stripePaymentIntent } = await GqlGetStripePaymentIntent({ stripePaymentMethod: StripePaymentMethodEnum.SETUP });
    const clientSecret = stripePaymentIntent?.clientSecret;
    if (!clientSecret) throw new Error('Stripe PaymentIntent client secret missing!');

    const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, { payment_method: { card: cardElement } });
    if (error) {
      throw new CheckoutInlineError(error.message);
    }
    
    const { source } = await stripe.createSource(cardElement as CreateSourceData);
    
    if (source) orderInput.value.metaData.push({ key: '_stripe_source_id', value: source.id });
    if (setupIntent) orderInput.value.metaData.push({ key: '_stripe_intent_id', value: setupIntent.id });

    orderInput.value.transactionId = setupIntent?.id || stripePaymentIntent.id;

    return setupIntent?.status === 'succeeded' || false;
  };

  const stripePaymentCheckout = async (stripe: Stripe, elements: StripeElements) => {

    const { error: submitError } = await elements.submit();
    if (submitError) {
      throw new CheckoutInlineError(submitError.message);
    }

    const { stripePaymentIntent } = await GqlGetStripePaymentIntent({ stripePaymentMethod: StripePaymentMethodEnum.PAYMENT });
    const clientSecret = stripePaymentIntent?.clientSecret;
    if (!clientSecret) throw new Error('Stripe PaymentIntent client secret missing!');
    if (!stripePaymentIntent.id) throw new Error('Stripe PaymentIntent id missing!');

    orderInput.value.metaData.push({ key: '_stripe_intent_id', value: stripePaymentIntent.id });
    orderInput.value.transactionId = stripePaymentIntent.id;

    // Let's save checkout orderInput & customer to maintain state after redirect
    // We are not sure whether the confirmSetup will redirect if needed or continue code execution
    manageCheckoutLocalStorage(true);

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
      },
      redirect: 'if_required',
    });

    if (error) {
      throw new CheckoutInlineError(error.message);
    }

    return paymentIntent.status === 'succeeded' || false;
  };

  const validateStripePaymentFromRedirect = async (stripe: Stripe, clientSecret: string, redirectStatus: string) => {
    try {
      if (redirectStatus !== 'succeeded') throw new CheckoutInlineError(t('messages.error.paymentFailed'));

      isProcessingOrder.value = true;
      const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret);
      if (error) {
        throw new Error(error.message);
      }

      switch (paymentIntent?.status) {
        case "succeeded":
          await proccessCheckout(true);
          break;
        case "processing":
          await proccessCheckout(false);
          break;
        case "requires_payment_method":
          // If the payment attempt fails (for example due to a decline), 
          // the PaymentIntent’s status returns to requires_payment_method so that the payment can be retried.
          throw new CheckoutInlineError(t('messages.error.paymentFailed'));
        default:
          throw new Error("Something went wrong. ('" + paymentIntent?.status + "')");
      }
    } catch (error: any) {
      isProcessingOrder.value = false;
      console.error(error);

      useRouter().push({ query: {} });
      manageCheckoutLocalStorage(false);
      
      if (error instanceof CheckoutInlineError) {
        errorMessage.value = error.message;
      } else {
        alert(error);
      }
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
    errorMessage,
    stripeCheckout,
    validateStripePaymentFromRedirect,
    proccessCheckout,
    updateShippingLocation,
  };
}

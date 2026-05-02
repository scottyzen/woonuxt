import type { CheckoutInput, CreateAccountInput, UpdateCustomerInput } from '#types/gql';

export function useCheckout() {
  const { customer, loginUser } = useAuth();
  const { cart, refreshCart, isUpdatingCart } = useCart();

  const resolvePaymentMethodId = (paymentMethod: unknown): string => {
    if (typeof paymentMethod === 'string') return paymentMethod;
    if (paymentMethod && typeof paymentMethod === 'object' && 'id' in paymentMethod) {
      return String((paymentMethod as { id?: string | null }).id ?? '');
    }

    return '';
  };

  const orderInput = useState<any>('orderInput', () => {
    return {
      customerNote: '',
      paymentMethod: '',
      createAccount: false,
      username: '',
      password: '',
      shipToDifferentAddress: false,
      metaData: [{ key: 'order_via', value: 'WooNuxt' }],
    };
  });

  const isProcessingOrder = useState<boolean>('isProcessingOrder', () => false);
  const checkoutError = ref<string | null>(null);

  // Helper function to build checkout payload
  const buildCheckoutPayload = (isPaid = false): CheckoutInput => {
    const { username, password, shipToDifferentAddress } = orderInput.value;
    const shippingSource = customer.value?.shipping ?? customer.value?.billing;
    const billingSource = shipToDifferentAddress ? customer.value?.billing : shippingSource;
    const billing = billingSource;
    const shipping = shipToDifferentAddress ? shippingSource : billingSource;
    const paymentMethodId = resolvePaymentMethodId(orderInput.value.paymentMethod);

    const payload: CheckoutInput = {
      billing,
      shipping,
      shippingMethod: cart.value?.chosenShippingMethods,
      metaData: orderInput.value.metaData,
      paymentMethod: paymentMethodId,
      customerNote: orderInput.value.customerNote,
      shipToDifferentAddress,
      transactionId: orderInput.value.transactionId,
      isPaid,
    };

    // Handle account creation
    if (orderInput.value.createAccount) {
      payload.account = { username, password } as CreateAccountInput;
    } else {
      payload.account = null;
    }

    return payload;
  };

  // Helper function to check if payment method is PayPal
  const isPayPalPayment = (): boolean => {
    const paymentId = resolvePaymentMethodId(orderInput.value.paymentMethod);
    return paymentId === 'paypal' || paymentId === 'ppcp-gateway';
  };

  const createOrderFallbackKey = (checkoutOrder: any, orderId: string, orderKey: string): string => {
    if (!import.meta.client) return '';

    try {
      const fallbackOrder = {
        ...(checkoutOrder || {}),
        databaseId: Number.parseInt(orderId, 10),
        orderKey,
      };
      const fallbackKey = `woonuxt-order-${orderId}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

      window.localStorage.setItem(`woonuxt:order-fallback:${fallbackKey}`, JSON.stringify(fallbackOrder));
      return fallbackKey;
    } catch {
      return '';
    }
  };

  // Helper function to handle PayPal redirect
  const handlePayPalRedirect = async (checkout: any, orderId: string, orderKey: string, fallbackOrderKey = ''): Promise<void> => {
    const { replaceQueryParam } = useHelpers();
    const router = useRouter();

    const frontEndUrl = window.location.origin;
    let redirectUrl = checkout?.redirect ?? '';
    const fallbackOrderQuery = fallbackOrderKey ? `&order_fallback_key=${fallbackOrderKey}` : '';

    const payPalReturnUrl = `${frontEndUrl}/checkout/order-received/${orderId}/?key=${orderKey}&from_paypal=true${fallbackOrderQuery}`;
    const payPalCancelUrl = `${frontEndUrl}/checkout/?cancel_order=true&from_paypal=true`;

    redirectUrl = replaceQueryParam('return', payPalReturnUrl, redirectUrl);
    redirectUrl = replaceQueryParam('cancel_return', payPalCancelUrl, redirectUrl);
    redirectUrl = replaceQueryParam('bn', 'WooNuxt_Cart', redirectUrl);

    const isPayPalWindowClosed = await openPayPalWindow(redirectUrl);

    if (isPayPalWindowClosed) {
      router.push(`/checkout/order-received/${orderId}/?key=${orderKey}&fetch_delay=true${fallbackOrderQuery}`);
    }
  };

  // Helper function to handle post-checkout account creation
  const handleAccountCreation = async (): Promise<void> => {
    if (orderInput.value.createAccount) {
      const { username, password } = orderInput.value;
      await loginUser({ username, password });
    }
  };

  // Helper function to finalize checkout
  const finalizeCheckout = async (checkout: any): Promise<void> => {
    if (checkout?.result !== 'success' && !checkout?.order?.databaseId) {
      checkoutError.value = 'There was an error processing your order. Please try again.';
    }
  };

  // if Country or State are changed, calculate the shipping rates again
  async function updateShippingLocation() {
    isUpdatingCart.value = true;

    try {
      const pickLocation = (address: any) => {
        if (!address) return {};
        const { address1, address2, city, country, postcode, state } = address;
        return { address1, address2, city, country, postcode, state };
      };

      if (!orderInput.value.shipToDifferentAddress && customer.value?.billing) {
        if (!customer.value.shipping) {
          customer.value.shipping = { ...customer.value.billing };
        } else {
          Object.assign(customer.value.shipping, { ...customer.value.billing });
        }
      }

      const shippingSource = customer.value?.shipping ?? customer.value?.billing;
      const billingSource = orderInput.value.shipToDifferentAddress ? customer.value?.billing : shippingSource;

      const shipping = pickLocation(shippingSource);
      const billing = pickLocation(billingSource);

      const { updateCustomer } = await GqlUpdateCustomer({
        input: {
          shipping,
          billing,
        } as UpdateCustomerInput,
      });

      if (!updateCustomer) {
        console.warn('[updateShippingLocation] updateCustomer returned null/false');
      }

      await refreshCart();
    } catch (error) {
      console.error('Error updating shipping location:', error);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  async function openPayPalWindow(redirectUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      const width = 750;
      const height = 750;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2 + 80;
      const payPalWindow = window.open(redirectUrl, '', `width=${width},height=${height},top=${top},left=${left}`);
      const timer = setInterval(() => {
        if (payPalWindow && payPalWindow.closed) {
          clearInterval(timer);
          resolve(true);
        }
      }, 500);
    });
  }

  const processCheckout = async (isPaid = false): Promise<any> => {
    const router = useRouter();

    isProcessingOrder.value = true;
    checkoutError.value = null;

    try {
      // Build checkout payload
      const checkoutPayload = buildCheckoutPayload(isPaid);

      // Process the checkout
      const { checkout } = await GqlCheckout(checkoutPayload);

      // Handle account creation if requested
      await handleAccountCreation();

      const orderId = checkout?.order?.databaseId?.toString();
      const orderKey = checkout?.order?.orderKey;

      // Ensure we have required order details
      if (!orderId || !orderKey) {
        if (checkout?.redirect && import.meta.client) {
          await finalizeCheckout(checkout);
          window.location.href = checkout.redirect;
          return checkout;
        }
        throw new Error('Order ID or order key is missing from checkout response');
      }

      const fallbackOrderKey = createOrderFallbackKey(checkout?.order, orderId, orderKey);
      const fallbackOrderQuery = fallbackOrderKey ? `&order_fallback_key=${fallbackOrderKey}` : '';

      // Handle PayPal redirect if needed
      if (checkout?.redirect && isPayPalPayment()) {
        await handlePayPalRedirect(checkout, orderId, orderKey, fallbackOrderKey);
      } else {
        // Standard redirect to order received page
        router.push(`/checkout/order-received/${orderId}/?key=${orderKey}${fallbackOrderQuery}`);
      }

      // Finalize the checkout
      await finalizeCheckout(checkout);

      return checkout;
    } catch (error: unknown) {
      console.error('Checkout error:', error);
      checkoutError.value = error instanceof Error && error.message ? error.message : 'An error occurred during checkout. Please try again.';
      return null;
    } finally {
      isProcessingOrder.value = false;
    }
  };

  return {
    orderInput,
    isProcessingOrder,
    checkoutError,
    processCheckout,
    updateShippingLocation,
    resolvePaymentMethodId,
  };
}

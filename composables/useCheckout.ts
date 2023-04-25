export function useCheckout() {
  const orderInput = useState<any>('orderInput', () => {
    return {
      customerNote: '',
      paymentMethod: '',
      shipToDifferentAddress: false,
      metaData: [{ key: 'order_via', value: 'WooNuxt' }],
    };
  });

  const isProcessingOrder = useState<boolean>('isProcessingOrder', () => false);

  const proccessCheckout = async () => {
    const router = useRouter();
    const { replaceQueryParam } = useHelpers();

    isProcessingOrder.value = true;

    const { refreshCart } = useCart();
    const { customer } = useAuth();

    const billing = {
      address1: customer.value.billing?.address1,
      address2: customer.value.billing?.address2,
      city: customer.value.billing?.city,
      company: customer.value.billing?.company,
      country: customer.value.billing?.country,
      email: customer.value.billing?.email,
      firstName: customer.value.billing?.firstName,
      lastName: customer.value.billing?.lastName,
      phone: customer.value.billing?.phone,
      postcode: customer.value.billing?.postcode,
      state: customer.value.billing?.state,
    };

    const shipping = {
      address1: customer.value.shipping?.address1,
      address2: customer.value.shipping?.address2,
      city: customer.value.shipping?.city,
      company: customer.value.shipping?.company,
      country: customer.value.shipping?.country,
      email: customer.value.shipping?.email,
      firstName: customer.value.shipping?.firstName,
      lastName: customer.value.shipping?.lastName,
      phone: customer.value.shipping?.phone,
      postcode: customer.value.shipping?.postcode,
      state: customer.value.shipping?.state,
    };

    const { checkout } = await GqlCheckout({
      billing,
      shipping: orderInput.value.shipToDifferentAddress ? shipping : billing,
      metaData: orderInput.value.metaData,
      paymentMethod: orderInput.value.paymentMethod,
      customerNote: orderInput.value.customerNote,
      shipToDifferentAddress: orderInput.value.shipToDifferentAddress,
    });

    if ((await checkout?.result) === 'success') {
      refreshCart();
    }

    const orderId = checkout?.order?.databaseId;
    const orderKey = checkout?.order?.orderKey;

    // PayPal redirect
    if ((await checkout?.redirect) && orderInput.value.paymentMethod === 'paypal') {
      const runtimeConfig = useRuntimeConfig();
      const frontEndUrl = runtimeConfig?.public?.FRONT_END_URL;
      let redirectUrl = checkout?.redirect || '';

      const payPalReturnUrl = `${frontEndUrl}/checkout/order-received/${orderId}/?key=${orderKey}`;
      const payPalCancelUrl = `${frontEndUrl}/checkout/?cancel_order=true`;

      redirectUrl = replaceQueryParam('return', payPalReturnUrl, redirectUrl);
      redirectUrl = replaceQueryParam('cancel_return', payPalCancelUrl, redirectUrl);
      redirectUrl = replaceQueryParam('bn', 'WooNuxt_Cart', redirectUrl);

      window.location.href = redirectUrl;
    } else {
      router.push(`/checkout/order-received/${orderId}/?key=${orderKey}`);
    }

    isProcessingOrder.value = false;
    return checkout;
  };

  return {
    orderInput,
    proccessCheckout,
    isProcessingOrder,
  };
}

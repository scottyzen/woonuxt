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
        },
      });

      if (updateCustomer) refreshCart();
    } catch (error) {
      console.error(error);
    }
  }

  const proccessCheckout = async () => {
    const { loginUser } = useAuth();
    const router = useRouter();
    const { replaceQueryParam } = useHelpers();

    isProcessingOrder.value = true;

    const { refreshCart, emptyCart } = useCart();
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
      email: customer.value.billing?.email,
      firstName: customer.value.shipping?.firstName,
      lastName: customer.value.shipping?.lastName,
      phone: customer.value.shipping?.phone,
      postcode: customer.value.shipping?.postcode,
      state: customer.value.shipping?.state,
    };

    try {
      let checkoutPayload = {
        billing,
        shipping: orderInput.value.shipToDifferentAddress ? shipping : billing,
        metaData: orderInput.value.metaData,
        paymentMethod: orderInput.value.paymentMethod,
        customerNote: orderInput.value.customerNote,
        shipToDifferentAddress: orderInput.value.shipToDifferentAddress,
      };

      if (orderInput.value.createAccount) {
        // @ts-ignore
        checkoutPayload.account = {
          username: customer.value.billing?.email,
          password: orderInput.value.password,
        };
      }

      const { checkout } = await GqlCheckout(checkoutPayload);

      if (orderInput.value.createAccount) {
        await loginUser({
          // @ts-ignore
          username: customer.value.billing?.email,
          password: orderInput.value.password,
        });
      }

      if ((await checkout?.result) === 'success') {
        emptyCart();
        refreshCart();
      } else {
        isProcessingOrder.value = false;
        alert('There was an error processing your order. Please try again.');
        window.location.reload();
        return;
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
    } catch (error: any) {
      const errorMessage = error?.gqlErrors?.[0].message;
      isProcessingOrder.value = false;
      alert(errorMessage);
      return null;
    }
  };

  return {
    orderInput,
    isProcessingOrder,
    proccessCheckout,
    updateShippingLocation,
  };
}

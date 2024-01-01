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
    const { isUpdatingCart, refreshCart, cart } = useCart();

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
    const { viewer } = useAuth();
    const { refreshCart, emptyCart, cart } = useCart();
    const { customer } = useAuth();
    console.log('cart');
    
    const shippingTotal = customer._object.$scart.shippingTotal;
    const shipingMethodId = customer._object.$scart.chosenShippingMethods[0];
    const shipingCost = parseInt(shippingTotal.replace('.', ''), 10);
    const listOfOrders = customer._object.$scart.contents;
    const lineItems = listOfOrders.nodes.map((node) => ({
      product_id: node.product.node.databaseId,
      quantity: node.quantity,
    }));
    console.log(lineItems);
    const billing = {
      address_1: customer.value.billing?.address1,
      address_2: customer.value.billing?.address2,
      city: customer.value.billing?.city,
      company: customer.value.billing?.company,
      country: customer.value.billing?.country,
      email: customer.value.billing?.email,
      first_name: customer.value.billing?.firstName,
      last_name: customer.value.billing?.lastName,
      phone: customer.value.billing?.phone,
      postcode: customer.value.billing?.postcode,
      state: customer.value.billing?.state,
    };

    const shipping = {
      address_1: customer.value.shipping?.address1,
      address_2: customer.value.shipping?.address2,
      city: customer.value.shipping?.city,
      company: customer.value.shipping?.company,
      country: customer.value.shipping?.country,
      email: customer.value.billing?.email,
      first_name: customer.value.shipping?.firstName,
      last_name: customer.value.shipping?.lastName,
      phone: customer.value.shipping?.phone,
      postcode: customer.value.shipping?.postcode,
      state: customer.value.shipping?.state,
    };
    //const { checkout } = await GqlCheckout(checkoutPayload);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic Y2tfNTZjNjgzNWMyMTIzNGVmYjg3M2ExYmY1YWI2NTUxYjdjYjdlMTM4NDpjc18wYmJmZTAzODJiZTQzZDFhM2MxNTUxMmQ0ZTFmYzMwNjQ4MjcyZTg1');
    const isCheckout = useFetch('https://gamaoutillage.net/wp-json/wc/v3/orders', {
      method: 'post',
      headers: myHeaders,
      body: {
        payment_method: 'cod',
        payment_method_title: 'Paiement à la livraison',
        billing: billing,
        shipping: shipping,
        set_paid: false,
        line_items: lineItems,
        shipping_lines: [
          {
            shipingMethodId: shipingMethodId,
            method_title: 'Tree Table Rate',
            total: shipingCost,
          },
        ],
      },
    })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

    /*
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
      const isCheckout = useFetch('https://gamaoutillage.net/wp-json/wc/v3/orders', {
        method: 'post',
        body: {},
      });
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
        const frontEndUrl = window.location.origin;
        let redirectUrl = checkout?.redirect ?? '';

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

      if (errorMessage?.includes('An account is already registered with your email address')) {
        alert('An account is already registered with your email address');
        return null;
      }

      alert(errorMessage);
      return null;
    }
    */
  };

  return {
    orderInput,
    isProcessingOrder,
    proccessCheckout,
    updateShippingLocation,
  };
}

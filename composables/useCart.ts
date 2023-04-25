export function useCart() {
  const cart = useState<Cart | null>('cart', () => null);
  const isShowingCart = useState<boolean>('isShowingCart', () => false);
  const isUpdatingCart = useState<boolean>('isUpdatingCart', () => false);
  const isUpdatingCoupon = useState<boolean>('isUpdatingCoupon', () => false);
  const paymentGateways = useState<PaymentGateway[]>('paymentGateways', () => []);

  // Refesh the cart from the server
  async function refreshCart() {
    try {
      const { cart, customer, viewer, paymentGateways } = await GqlGetCart();

      const { updateCustomer, updateViewer } = useAuth() as any;
      if (cart) updateCart(cart);
      if (customer) updateCustomer(customer);
      if (viewer) updateViewer(viewer);
      if (paymentGateways) updatePaymentGateways(paymentGateways.nodes);

      return cart;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }

  function updateCart(payload: Cart): void {
    cart.value = payload;
  }

  function updatePaymentGateways(payload: PaymentGateway[]): void {
    paymentGateways.value = payload;
  }

  // toggle the cart visibility
  function toggleCart(state: boolean | undefined = undefined): void {
    state === undefined ? (isShowingCart.value = !isShowingCart.value) : (isShowingCart.value = state);
  }

  // add an item to the cart
  async function addToCart(input: AddToCartInput) {
    isUpdatingCart.value = true;
    const { addToCart } = await GqlAddToCart({ input });
    cart.value = addToCart?.cart || null;
  }

  // remove an item from the cart
  async function removeItem(key: string) {
    isUpdatingCart.value = true;
    const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity: 0 });
    cart.value = updateItemQuantities?.cart || null;
  }

  // update the quantity of an item in the cart
  async function updateItemQuantity(key: string, quantity: number) {
    isUpdatingCart.value = true;
    const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity });
    cart.value = updateItemQuantities?.cart || null;
    return quantity;
  }

  // empty the cart
  async function emptyCart(): Promise<void> {
    const { emptyCart } = await GqlEmptyCart();
    cart.value = emptyCart?.cart || null;
  }

  // Update shipping method
  async function updateShippingMethod(shippingMethods: string) {
    isUpdatingCart.value = true;
    const { updateShippingMethod } = await GqlChangeShippingMethod({ shippingMethods });
    cart.value = updateShippingMethod?.cart || null;
  }

  // Apply coupon
  async function applyCoupon(code: string) {
    try {
      isUpdatingCoupon.value = true;
      const { applyCoupon } = await GqlApplyCoupon({ code });
      cart.value = applyCoupon?.cart || null;
      isUpdatingCoupon.value = false;
      return { message: null };
    } catch (error: any) {
      isUpdatingCoupon.value = false;
      const gqlErrors = error?.gqlErrors;
      if (gqlErrors) {
        const message = gqlErrors[0]?.message;
        if (message) {
          return { message };
        }
      }
    }
  }

  // Remove coupon
  async function removeCoupon(code: string) {
    try {
      const { removeCoupons } = await GqlRemoveCoupons({ codes: [code] });
      cart.value = removeCoupons?.cart || null;
    } catch (error) {
      console.error(error);
    }
  }

  watch(cart, (val) => {
    isUpdatingCart.value = false;
  });

  return {
    cart,
    isShowingCart,
    isUpdatingCart,
    isUpdatingCoupon,
    refreshCart,
    toggleCart,
    addToCart,
    removeItem,
    updateItemQuantity,
    emptyCart,
    updateShippingMethod,
    applyCoupon,
    removeCoupon,
    paymentGateways,
  };
}

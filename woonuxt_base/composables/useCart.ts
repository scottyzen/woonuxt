/**
 * @name useCart
 * @description A composable that handles the cart in local storage
 */

export function useCart() {
  const cart = useState<Cart | null>('cart');
  const isShowingCart = useState<boolean>('isShowingCart', () => false);
  const isUpdatingCart = useState<boolean>('isUpdatingCart', () => false);
  const isUpdatingCoupon = useState<boolean>('isUpdatingCoupon', () => false);
  const paymentGateways = useState<PaymentGateway[]>('paymentGateways', () => []);

  // Refesh the cart from the server
  async function refreshCart() {
    try {
      const { cart, customer, viewer, paymentGateways } = await GqlGetCart();

      const { updateCustomer, updateViewer } = useAuth();
      if (cart) updateCart(cart);
      if (customer) updateCustomer(customer);
      if (viewer) updateViewer(viewer);
      if (paymentGateways) updatePaymentGateways(paymentGateways.nodes);

      return cart;
    } catch (error: any) {
      console.error(error);
    }

    return null;
  }

  function updateCart(payload: Cart | null): void {
    cart.value = payload;
  }

  function updatePaymentGateways(payload: PaymentGateway[]): void {
    paymentGateways.value = payload;
  }

  // toggle the cart visibility
  function toggleCart(state: boolean | undefined = undefined): void {
    isShowingCart.value = state ?? !isShowingCart.value;
  }

  // add an item to the cart
  async function addToCart(input: AddToCartInput): Promise<void> {
    isUpdatingCart.value = true;

    try {
      const { addToCart } = await GqlAddToCart({ input });
      cart.value = addToCart?.cart ?? null;
    } catch (error: any) {
      const errorMessage = error?.gqlErrors?.[0].message;
      if (errorMessage) console.error(errorMessage);
    }
  }

  // remove an item from the cart
  async function removeItem(key: string) {
    isUpdatingCart.value = true;
    const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity: 0 });
    cart.value = updateItemQuantities?.cart ?? null;
  }

  // update the quantity of an item in the cart
  async function updateItemQuantity(key: string, quantity: number): Promise<number> {
    isUpdatingCart.value = true;
    try {
      const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity });
      cart.value = updateItemQuantities?.cart ?? null;
      return quantity;
    } catch (error: any) {
      const errorMessage = error?.gqlErrors?.[0]?.message;
      if (errorMessage) {
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
      throw new Error('An unknown error occurred while updating item quantity');
    }
  }

  // empty the cart
  async function emptyCart(): Promise<void> {
    try {
      const { emptyCart } = await GqlEmptyCart();
      updateCart(emptyCart?.cart ?? null);
    } catch (error: any) {
      console.log(error);
    }
  }

  // Update shipping method
  async function updateShippingMethod(shippingMethods: string) {
    isUpdatingCart.value = true;
    const { updateShippingMethod } = await GqlChangeShippingMethod({ shippingMethods });
    cart.value = updateShippingMethod?.cart ?? null;
  }

  // Apply coupon
  async function applyCoupon(code: string): Promise<{ message: string | null }> {
    try {
      isUpdatingCoupon.value = true;
      const { applyCoupon } = await GqlApplyCoupon({ code });
      cart.value = applyCoupon?.cart ?? null;
      isUpdatingCoupon.value = false;
    } catch (error: any) {
      isUpdatingCoupon.value = false;
      const gqlErrors = error?.gqlErrors;
      if (gqlErrors) {
        const message = gqlErrors[0]?.message;
        if (message) return { message };
      }
    }
    return { message: null };
  }

  // Remove coupon
  async function removeCoupon(code: string): Promise<void> {
    try {
      isUpdatingCart.value = true;
      const { removeCoupons } = await GqlRemoveCoupons({ codes: [code] });
      cart.value = removeCoupons?.cart ?? null;
      isUpdatingCart.value = false;
    } catch (error) {
      console.error(error);
      isUpdatingCart.value = false;
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
    paymentGateways,
    updateCart,
    refreshCart,
    toggleCart,
    addToCart,
    removeItem,
    updateItemQuantity,
    emptyCart,
    updateShippingMethod,
    applyCoupon,
    removeCoupon,
  };
}

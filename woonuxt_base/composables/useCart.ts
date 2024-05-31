import type { AddToCartInput } from '#gql';

/**
 * @name useCart
 * @description A composable that handles the cart in local storage
 */
export function useCart() {
  const cart = useState<Cart>('cart');
  const isShowingCart = useState<boolean>('isShowingCart', () => false);
  const isUpdatingCart = useState<boolean>('isUpdatingCart', () => false);
  const isUpdatingCoupon = useState<boolean>('isUpdatingCoupon', () => false);
  const paymentGateways = useState<PaymentGateways>('paymentGateways', () => null);
  const { logGQLError } = useHelpers();
  const runtimeConfig = useRuntimeConfig();

  // Refesh the cart from the server
  async function refreshCart() {
    try {
      const { cart, customer, viewer, paymentGateways } = await GqlGetCart();

      const { updateCustomer, updateViewer } = useAuth();
      if (cart) updateCart(cart);
      if (customer) updateCustomer(customer);
      if (viewer) updateViewer(viewer);
      if (paymentGateways) updatePaymentGateways(paymentGateways);

      return { cart, customer, viewer, paymentGateways };
    } catch (error: any) {
      logGQLError(error);
      return { cart: null, customer: null, viewer: null, paymentGateways: null };
    }
  }

  function updateCart(payload: Cart | null): void {
    cart.value = payload;
  }

  function updatePaymentGateways(payload: PaymentGateways): void {
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
      // Auto open the cart when an item is added to the cart if the setting is enabled
      if (runtimeConfig.public?.AUTO_OPEN_CART === 'true' && !isShowingCart.value) toggleCart(true);
    } catch (error: any) {
      logGQLError(error);
    }
  }

  // remove an item from the cart
  async function removeItem(key: string) {
    isUpdatingCart.value = true;
    const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity: 0 });
    cart.value = updateItemQuantities?.cart ?? null;
  }

  // update the quantity of an item in the cart
  async function updateItemQuantity(key: string, quantity: number): Promise<number | undefined> {
    isUpdatingCart.value = true;
    try {
      const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity });
      cart.value = updateItemQuantities?.cart ?? null;
      return quantity;
    } catch (error: any) {
      logGQLError(error);
      return undefined;
    }
  }

  // empty the cart
  async function emptyCart(): Promise<void> {
    try {
      const { emptyCart } = await GqlEmptyCart();
      updateCart(emptyCart?.cart ?? null);
    } catch (error: any) {
      logGQLError(error);
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
      logGQLError(error);
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
      logGQLError(error);
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

import type { AddToCartInput } from '#gql';

/**
 * @name useCart
 * @description A composable that handles the cart in local storage
 */
export function useCart() {
  const { storeSettings } = useAppConfig();

  const cart = useState<Cart | null>('cart', () => null);
  const isShowingCart = useState<boolean>('isShowingCart', () => false);
  const isUpdatingCart = useState<boolean>('isUpdatingCart', () => false);
  const isUpdatingCoupon = useState<boolean>('isUpdatingCoupon', () => false);
  const paymentGateways = useState<PaymentGateways | null>('paymentGateways', () => null);
  const { clearAllCookies, getErrorMessage } = useHelpers();

  /** Refesh the cart from the server
   * @returns {Promise<boolean>} - A promise that resolves
   * to true if the cart was successfully refreshed
   */
  async function refreshCart(): Promise<boolean> {
    try {
      const { cart, customer, viewer, paymentGateways, loginClients } = await GqlGetCart();
      const { updateCustomer, updateViewer, updateLoginClients } = useAuth();

      if (cart) updateCart(cart);
      if (customer) updateCustomer(customer);
      if (viewer) updateViewer(viewer);
      if (paymentGateways) updatePaymentGateways(paymentGateways);
      if (loginClients) updateLoginClients(loginClients.filter((client) => client !== null));

      return true; // Cart was successfully refreshed
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      console.error('Error refreshing cart:', errorMsg);
      clearAllCookies();
      resetInitialState();
      return false; // Cart was not successfully refreshed
    } finally {
      isUpdatingCart.value = false;
    }
  }

  function resetInitialState() {
    cart.value = null;
    paymentGateways.value = null;
  }

  function updateCart(payload?: Cart | null): void {
    cart.value = payload || null;
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
      if (addToCart?.cart) cart.value = addToCart.cart;
      // Auto open the cart when an item is added to the cart if the setting is enabled
      const { storeSettings } = useAppConfig();
      if (storeSettings.autoOpenCart && !isShowingCart.value) toggleCart(true);
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      console.error('Error adding to cart:', errorMsg);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  // remove an item from the cart
  async function removeItem(key: string): Promise<void> {
    isUpdatingCart.value = true;
    try {
      const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity: 0 });
      updateCart(updateItemQuantities?.cart);
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      console.error('Error removing item from cart:', errorMsg);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  // update the quantity of an item in the cart
  async function updateItemQuantity(key: string, quantity: number): Promise<void> {
    isUpdatingCart.value = true;
    try {
      const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity });
      updateCart(updateItemQuantities?.cart);
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      console.error('Error updating item quantity:', errorMsg);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  // empty the cart
  async function emptyCart(): Promise<void> {
    try {
      isUpdatingCart.value = true;
      const { emptyCart } = await GqlEmptyCart();
      updateCart(emptyCart?.cart);
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      console.error('Error emptying cart:', errorMsg);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  // Update shipping method
  async function updateShippingMethod(shippingMethods: string): Promise<void> {
    isUpdatingCart.value = true;
    try {
      const { updateShippingMethod } = await GqlChangeShippingMethod({ shippingMethods });
      updateCart(updateShippingMethod?.cart);
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      console.error('Error updating shipping method:', errorMsg);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  // Apply coupon
  async function applyCoupon(code: string): Promise<ApiResponse<Cart | null>> {
    try {
      isUpdatingCoupon.value = true;
      const { applyCoupon } = await GqlApplyCoupon({ code });
      updateCart(applyCoupon?.cart);
      return { success: true, data: applyCoupon?.cart || null };
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      return { success: false, error: errorMsg };
    } finally {
      isUpdatingCoupon.value = false;
    }
  }

  // Remove coupon
  async function removeCoupon(code: string): Promise<void> {
    try {
      isUpdatingCart.value = true;
      const { removeCoupons } = await GqlRemoveCoupons({ codes: [code] });
      updateCart(removeCoupons?.cart);
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      console.error('Error removing coupon:', errorMsg);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  // Stop the loading spinner when the cart is updated
  watch(cart, (val) => {
    isUpdatingCart.value = false;
  });

  // Check if all products in the cart are virtual
  const allProductsAreVirtual = computed(() => {
    const nodes = cart.value?.contents?.nodes || [];
    return nodes.length === 0 ? false : nodes.every((node) => (node.product?.node as SimpleProduct)?.virtual === true);
  });

  // Check if the billing address is enabled
  const isBillingAddressEnabled = computed(() => (storeSettings.hideBillingAddressForVirtualProducts ? !allProductsAreVirtual.value : true));

  return {
    cart,
    isShowingCart,
    isUpdatingCart,
    isUpdatingCoupon,
    paymentGateways,
    isBillingAddressEnabled,
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

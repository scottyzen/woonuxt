export function useCart() {
  const cart = useState<any>('cart', () => null);
  const isShowingCart = useState<boolean>('isShowingCart', () => false);
  const isUpdatingCart = useState<boolean>('isUpdatingCart', () => false);
  const isUpdatingCoupon = useState<boolean>('isUpdatingCoupon', () => false);

  // Refesh the cart from the server
  async function refreshCart() {
    try {
      const data = await GqlGetCart();
      cart.value = data.cart || null;

      const { updateCustomer, updateViewer } = useAuth();
      updateCustomer(data.customer);
      updateViewer(data.viewer);

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // toggle the cart visibility
  function toggleCart(state: boolean | undefined = undefined) {
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
    const { updateItemQuantities } = await GqlUpDateCartQuantity({
      key,
      quantity: 0,
    });
    cart.value = updateItemQuantities?.cart || null;
  }

  // update the quantity of an item in the cart
  async function updateItemQuantity(key: string, quantity: number) {
    isUpdatingCart.value = true;
    const { updateItemQuantities } = await GqlUpDateCartQuantity({
      key,
      quantity,
    });
    cart.value = updateItemQuantities?.cart || null;
    return quantity;
  }

  // empty the cart
  async function emptyCart() {
    const { emptyCart } = await GqlEmptyCart();
    cart.value = emptyCart?.cart || null;
  }

  // Update shipping method
  async function updateShippingMethod(shippingMethodId: string) {
    isUpdatingCart.value = true;
    const { updateShippingMethod } = await GqlChangeShippingMethod({
      shippingMethods: shippingMethodId,
    });
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
    }
    catch (error) {
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
    }
    catch (error) {
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
  };
}

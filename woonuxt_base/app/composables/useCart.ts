import type { AddToCartInput, ApiResponse, Cart, PaymentGateways, ProductDetail, SimpleProduct, Variation } from '#types/gql';

let cartMutationQueue: Promise<void> = Promise.resolve();

/**
 * @name useCart
 * @description A composable that handles the cart in local storage
 */
export function useCart() {
  const { storeSettings } = useAppConfig();

  const cart = useState<Cart | null>('cart', () => null);
  const isShowingCart = useState<boolean>('isShowingCart', () => false);
  const isUpdatingCart = useState<boolean>('isUpdatingCart', () => false);
  const isAddingToCart = useState<boolean>('isAddingToCart', () => false);
  const isUpdatingCoupon = useState<boolean>('isUpdatingCoupon', () => false);
  const optimisticPendingMutations = useState<number>('optimisticPendingMutations', () => 0);
  const optimisticServerCart = useState<Cart | null>('optimisticServerCart', () => null);
  const optimisticHadError = useState<boolean>('optimisticHadError', () => false);
  const paymentGateways = useState<PaymentGateways | null>('paymentGateways', () => null);
  const { clearAllCookies, getErrorMessage } = useHelpers();

  type CartNode = NonNullable<NonNullable<Cart['contents']>['nodes']>[number];
  type CartItem = CartNode & { key: string };
  type OptimisticAddPayload = {
    product: ProductDetail;
    variation?: Variation | null;
  };

  const normalizeQuantity = (value?: number | string | null): number => {
    const qty = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(qty) && qty > 0 ? qty : 1;
  };

  const normalizeCountQuantity = (value?: number | string | null): number => {
    const qty = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(qty) && qty > 0 ? qty : 0;
  };

  const buildEmptyCart = (): Cart =>
    ({
      isEmpty: true,
      contents: {
        itemCount: 0,
        productCount: 0,
        nodes: [],
      },
    }) as Cart;

  const getOptimisticBase = (): Cart => cart.value ?? buildEmptyCart();

  const createOptimisticKey = (): string => `optimistic:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;

  const buildOptimisticProductNode = (product: ProductDetail) => ({
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    databaseId: product.databaseId,
    type: product.type,
    price: product.price,
    rawPrice: product.rawPrice,
    regularPrice: product.regularPrice,
    rawRegularPrice: product.rawRegularPrice ?? product.regularPrice ?? null,
    salePrice: product.salePrice,
    rawSalePrice: product.rawSalePrice ?? product.salePrice ?? null,
    stockStatus: product.stockStatus,
    stockQuantity: product.stockQuantity,
    lowStockAmount: product.lowStockAmount,
    image: product.image,
  });

  const buildOptimisticVariationNode = (variation?: Variation | null) => {
    if (!variation) return null;
    return {
      ...variation,
      rawRegularPrice: (variation as { rawRegularPrice?: string | null }).rawRegularPrice ?? variation.regularPrice ?? null,
      rawSalePrice: (variation as { rawSalePrice?: string | null }).rawSalePrice ?? variation.salePrice ?? null,
    };
  };

  const buildOptimisticItem = (payload: OptimisticAddPayload, quantity: number): CartItem => {
    const productNode = buildOptimisticProductNode(payload.product);
    const variationNode = buildOptimisticVariationNode(payload.variation);

    return {
      key: createOptimisticKey(),
      quantity,
      product: {
        node: productNode,
        image: productNode.image,
      },
      variation: variationNode ? { node: variationNode } : null,
    } as CartItem;
  };

  const matchesOptimisticTarget = (node: CartItem, payload: OptimisticAddPayload): boolean => {
    const nodeVariationId = (node.variation?.node as { databaseId?: number } | null)?.databaseId;
    if (payload.variation?.databaseId && nodeVariationId) {
      return nodeVariationId === payload.variation.databaseId;
    }
    if (payload.variation?.slug) {
      return node.variation?.node?.slug === payload.variation.slug;
    }
    return node.product?.node?.databaseId === payload.product.databaseId;
  };

  const applyOptimisticAdd = (payload: OptimisticAddPayload, quantity: number): void => {
    const base = getOptimisticBase();
    const nodes = (base.contents?.nodes ?? []).filter((node): node is CartItem => !!node?.key);
    const matchIndex = nodes.findIndex((node) => matchesOptimisticTarget(node, payload));

    if (matchIndex >= 0) {
      const existing = nodes[matchIndex];
      if (!existing) return;
      nodes[matchIndex] = {
        ...existing,
        quantity: normalizeQuantity(existing.quantity) + quantity,
      };
    } else {
      nodes.unshift(buildOptimisticItem(payload, quantity));
    }

    const itemCount = nodes.reduce((sum, node) => sum + normalizeQuantity(node.quantity), 0);
    const productCount = nodes.length;

    const nextCart: Cart = {
      ...base,
      contents: {
        ...(base.contents ?? {}),
        nodes,
        itemCount,
        productCount,
      },
      isEmpty: nodes.length === 0,
    };
    cart.value = nextCart;
  };

  const applyOptimisticEmptyCart = (): void => {
    cart.value = buildEmptyCart();
  };

  const applyOptimisticQuantityChange = (key: string, quantity: number): void => {
    const base = getOptimisticBase();
    const nodes = (base.contents?.nodes ?? []).filter((node): node is CartItem => !!node?.key);
    const matchIndex = nodes.findIndex((node) => node.key === key);
    if (matchIndex < 0) return;

    const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
    if (safeQuantity === 0) {
      nodes.splice(matchIndex, 1);
    } else {
      const existing = nodes[matchIndex];
      if (!existing) return;
      nodes[matchIndex] = {
        ...existing,
        quantity: safeQuantity,
      };
    }

    const itemCount = nodes.reduce((sum, node) => sum + normalizeCountQuantity(node.quantity), 0);
    const productCount = nodes.length;

    const nextCart: Cart = {
      ...base,
      contents: {
        ...(base.contents ?? {}),
        nodes,
        itemCount,
        productCount,
      },
      isEmpty: nodes.length === 0,
    };
    cart.value = nextCart;
  };

  const finalizeOptimisticMutations = async (): Promise<void> => {
    if (optimisticPendingMutations.value !== 0) return;
    if (optimisticHadError.value) {
      optimisticHadError.value = false;
      await refreshCart();
      return;
    }
    if (optimisticServerCart.value) {
      cart.value = optimisticServerCart.value;
      optimisticServerCart.value = null;
    }
  };

  const enqueueCartMutation = (fn: () => Promise<Cart | null>, optimistic: boolean): Promise<void> => {
    const run = cartMutationQueue
      .catch(() => {})
      .then(async () => {
        try {
          const nextCart = await fn();
          if (optimistic) {
            if (nextCart) optimisticServerCart.value = nextCart;
          } else if (nextCart) {
            cart.value = nextCart;
          }
        } catch (error: unknown) {
          const errorMsg = getErrorMessage(error);
          console.error('Error updating cart:', errorMsg);
          if (optimistic) optimisticHadError.value = true;
          throw error;
        }
      });

    cartMutationQueue = run.catch(() => {});
    return run;
  };

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
    } catch (error: unknown) {
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
  async function addToCart(input: AddToCartInput, optimistic?: OptimisticAddPayload): Promise<void> {
    isAddingToCart.value = true;
    const quantity = normalizeQuantity(input.quantity);
    // cartMode controls whether we update UI immediately or wait for server confirmation.
    const cartMode = storeSettings.cartMode ?? 'optimistic';
    const shouldOptimistic = !!optimistic?.product && cartMode === 'optimistic';
    const canOptimistic = shouldOptimistic;
    const shouldShowCartUpdating = !canOptimistic;

    if (shouldShowCartUpdating) {
      isUpdatingCart.value = true;
    }

    try {
      if (canOptimistic) {
        applyOptimisticAdd(optimistic, quantity);
        if (storeSettings.autoOpenCart && !isShowingCart.value) toggleCart(true);
        optimisticPendingMutations.value += 1;
        void enqueueCartMutation(async () => {
          const { addToCart } = await GqlAddToCart({ input: { ...input, quantity } });
          return addToCart?.cart ?? null;
        }, true).finally(async () => {
          optimisticPendingMutations.value = Math.max(0, optimisticPendingMutations.value - 1);
          await finalizeOptimisticMutations();
        });
        return;
      }

      await enqueueCartMutation(async () => {
        const { addToCart } = await GqlAddToCart({ input: { ...input, quantity } });
        return addToCart?.cart ?? null;
      }, false);
      // Auto open the cart when an item is added to the cart if the setting is enabled
      if (!canOptimistic && storeSettings.autoOpenCart && !isShowingCart.value) toggleCart(true);
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);
      console.error('Error adding to cart:', errorMsg);
    } finally {
      isAddingToCart.value = false;
      if (shouldShowCartUpdating) isUpdatingCart.value = false;
    }
  }

  // remove an item from the cart
  async function removeItem(key: string): Promise<void> {
    await updateItemQuantity(key, 0);
  }

  // update the quantity of an item in the cart
  async function updateItemQuantity(key: string, quantity: number): Promise<void> {
    const cartMode = storeSettings.cartMode ?? 'optimistic';
    const canOptimistic = cartMode === 'optimistic';

    if (canOptimistic) {
      applyOptimisticQuantityChange(key, quantity);
      optimisticPendingMutations.value += 1;
      void enqueueCartMutation(async () => {
        const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity });
        return updateItemQuantities?.cart ?? null;
      }, true).finally(async () => {
        optimisticPendingMutations.value = Math.max(0, optimisticPendingMutations.value - 1);
        await finalizeOptimisticMutations();
      });
      return;
    }

    isUpdatingCart.value = true;
    try {
      const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity });
      updateCart(updateItemQuantities?.cart);
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);
      console.error('Error updating item quantity:', errorMsg);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  // empty the cart
  async function emptyCart(): Promise<void> {
    const cartMode = storeSettings.cartMode ?? 'optimistic';
    const canOptimistic = cartMode === 'optimistic';

    if (canOptimistic) {
      applyOptimisticEmptyCart();
      optimisticPendingMutations.value += 1;
      void enqueueCartMutation(async () => {
        const { emptyCart } = await GqlEmptyCart();
        return emptyCart?.cart ?? null;
      }, true).finally(async () => {
        optimisticPendingMutations.value = Math.max(0, optimisticPendingMutations.value - 1);
        await finalizeOptimisticMutations();
      });
      return;
    }

    try {
      isUpdatingCart.value = true;
      const { emptyCart } = await GqlEmptyCart();
      updateCart(emptyCart?.cart);
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);
      // Don't log error if cart is already empty
      if (errorMsg && !errorMsg.toLowerCase().includes('cart is empty')) {
        console.error('Error emptying cart:', errorMsg);
      }
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);
      console.error('Error removing coupon:', errorMsg);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  // Stop the loading spinner when the cart is updated
  watch(cart, () => {
    if (!isUpdatingCart.value) return;
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
    isAddingToCart,
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

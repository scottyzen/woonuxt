import type { AddToCartInput, ApiResponse, Cart, Customer, PaymentGateways, SimpleProduct } from '#types/gql';

import { GetCartDocument } from '#gql/default';
import type { GetCartQuery } from '#gql/default';

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
  const isUpdatingCoupon = useState<boolean>('isUpdatingCoupon', () => false);
  const paymentGateways = useState<PaymentGateways | null>('paymentGateways', () => null);
  const { getDomain, getErrorContext, getErrorMessage } = useHelpers();

  const normalizeQuantity = (value?: number | string | null): number => {
    const qty = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(qty) && qty > 0 ? qty : 1;
  };

  const enqueueCartMutation = (fn: () => Promise<Cart | null>): Promise<void> => {
    const run = cartMutationQueue
      .catch(() => {})
      .then(async () => {
        try {
          const nextCart = await fn();
          if (nextCart) {
            cart.value = nextCart;
          }
        } catch (error: unknown) {
          const errorMsg = getErrorMessage(error);
          console.error('Error updating cart:', errorMsg);
          throw error;
        }
      });

    cartMutationQueue = run.catch(() => {});
    return run;
  };

  type CartQueryPayload = {
    cart?: Cart | null;
    customer?: any;
    viewer?: any;
    paymentGateways?: PaymentGateways | null;
    loginClients?: Array<any> | null;
  };

  const syncWooSession = (token?: string | null): void => {
    if (!token) return;
    useGqlHeaders({ 'woocommerce-session': `Session ${token}` });

    if (!import.meta.client) return;
    const domain = getDomain(window.location.href);
    const cookieOptions = domain ? { domain, path: '/' } : { path: '/' };
    const sessionCookie = useCookie<string | null>('woocommerce-session', cookieOptions);
    sessionCookie.value = token;
  };

  const applyCartSnapshot = (payload: CartQueryPayload): void => {
    const { updateCustomer, updateViewer, updateLoginClients } = useAuth();
    const { cart, customer, viewer, paymentGateways, loginClients } = payload;
    const hasKey = (key: keyof CartQueryPayload) => Object.prototype.hasOwnProperty.call(payload, key);

    if (hasKey('cart')) updateCart(cart ?? null);
    if (hasKey('viewer')) updateViewer(viewer ?? null);
    if (customer) updateCustomer(customer);
    if (!customer?.sessionToken && viewer?.wooSessionToken) syncWooSession(viewer.wooSessionToken);

    if (paymentGateways) updatePaymentGateways(paymentGateways);
    if (loginClients) updateLoginClients(loginClients.filter((client) => client !== null));
  };

  const extractCartPayloadFromError = (error: unknown): CartQueryPayload | null => {
    const candidate = (error as any)?.response?.data?.data ?? (error as any)?.response?.data ?? (error as any)?.data?.data ?? (error as any)?.data ?? null;

    if (!candidate || typeof candidate !== 'object') return null;

    const hasUsableCartFields =
      Object.prototype.hasOwnProperty.call(candidate, 'cart') ||
      Object.prototype.hasOwnProperty.call(candidate, 'customer') ||
      Object.prototype.hasOwnProperty.call(candidate, 'viewer') ||
      Object.prototype.hasOwnProperty.call(candidate, 'paymentGateways') ||
      Object.prototype.hasOwnProperty.call(candidate, 'loginClients');

    return hasUsableCartFields ? (candidate as CartQueryPayload) : null;
  };

  const fetchCartSnapshot = async (): Promise<CartQueryPayload> => {
    const { refreshAuthToken } = useAuthTokens();
    await refreshAuthToken();

    const nuxtApp = useNuxtApp() as {
      _gqlState?: {
        value?: Record<string, { instance?: { request: <T>(args: { document: string; variables?: any }) => Promise<T> } }>;
      };
    };
    const state = nuxtApp?._gqlState?.value ?? {};
    const primaryClientState = state.default ?? state[Object.keys(state)[0] ?? ''];
    const gqlClient = primaryClientState?.instance;

    if (!gqlClient?.request) {
      throw new Error('GraphQL client instance is not available');
    }

    return await gqlClient.request<GetCartQuery>({ document: GetCartDocument });
  };

  /** Refesh the cart from the server
   * @returns {Promise<boolean>} - A promise that resolves
   * to true if the cart was successfully refreshed
   */
  async function refreshCart(): Promise<boolean> {
    try {
      const payload = await fetchCartSnapshot();
      applyCartSnapshot(payload as CartQueryPayload);
      return true; // Cart was successfully refreshed
    } catch (error: unknown) {
      const recoveredPayload = extractCartPayloadFromError(error);
      if (recoveredPayload) {
        applyCartSnapshot(recoveredPayload);
        return true;
      }

      const { isAuthError } = getErrorContext(error);

      if (isAuthError) {
        const { refreshAuthToken, clearActiveAuthToken } = useAuthTokens();
        const refreshed = await refreshAuthToken(true);
        if (refreshed) {
          try {
            const retryPayload = await fetchCartSnapshot();
            applyCartSnapshot(retryPayload as CartQueryPayload);
            return true;
          } catch {}
        }

        clearActiveAuthToken();
        useGqlHeaders({ Authorization: '' });

        const { updateCustomer, updateViewer } = useAuth();
        updateViewer(null);

        const sessionCookie = import.meta.client
          ? useCookie<string | null>('woocommerce-session', { domain: getDomain(window.location.href), path: '/' }).value ||
            useCookie<string | null>('woocommerce-session', { path: '/' }).value
          : null;

        if (!sessionCookie) {
          updateCustomer({ billing: {}, shipping: {} } as Customer);
        }
      }

      if (!isAuthError) {
        getErrorMessage(error);
      }
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
    const quantity = normalizeQuantity(input.quantity);

    try {
      await enqueueCartMutation(async () => {
        const { addToCart } = await GqlAddToCart({ input: { ...input, quantity } });
        return addToCart?.cart ?? null;
      });
      // Auto open the cart when an item is added to the cart if the setting is enabled
      if (storeSettings.autoOpenCart && !isShowingCart.value) toggleCart(true);
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);
      console.error('Error adding to cart:', errorMsg);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  // remove an item from the cart
  async function removeItem(key: string): Promise<void> {
    await updateItemQuantity(key, 0);
  }

  // update the quantity of an item in the cart
  async function updateItemQuantity(key: string, quantity: number): Promise<void> {
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

  // Check if all products in the cart are virtual
  const allProductsAreVirtual = computed(() => {
    const nodes = cart.value?.contents?.nodes || [];
    return nodes.length === 0 ? false : nodes.every((node) => (node.product?.node as SimpleProduct)?.virtual === true);
  });

  const isCartMutating = computed(() => isUpdatingCart.value);

  // Check if the billing address is enabled
  const isBillingAddressEnabled = computed(() => (storeSettings.hideBillingAddressForVirtualProducts ? !allProductsAreVirtual.value : true));

  return {
    cart,
    isShowingCart,
    isUpdatingCart,
    isCartMutating,
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

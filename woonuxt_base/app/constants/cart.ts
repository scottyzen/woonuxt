/** Cookie and request-header name WPGraphQL-WooCommerce uses for the cart session. */
export const WOO_SESSION_KEY = 'woocommerce-session';

/** Cart shape used before the server has returned a cart (e.g. first optimistic add). */
export const createEmptyCart = () => ({ isEmpty: true, contents: { itemCount: 0, productCount: 0, nodes: [] } });

import pkg from '../../../woonuxt_base/package.json';

// A collection of helper functions.
export function useHelpers() {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  const requestOrigin = import.meta.server ? useRequestURL().origin : import.meta.client ? window.location.origin : undefined;

  const isShowingMobileMenu = useState<boolean>('isShowingMobileMenu', () => false);
  const wooNuxtVersionInfo: string = pkg.version || '0.0.0';
  const productsPerPage: number = runtimeConfig.public?.PRODUCTS_PER_PAGE || 24;
  const wooNuxtSEO = Array.isArray(runtimeConfig.public?.WOO_NUXT_SEO) ? runtimeConfig.public?.WOO_NUXT_SEO : [];
  const frontEndUrl = runtimeConfig.public?.FRONT_END_URL?.replace(/\/$/, '') || requestOrigin;
  const isDev: boolean = process.env.NODE_ENV === 'development';
  const FALLBACK_IMG = '/images/placeholder.jpg';

  /**
   * Toggles the mobile menu.
   */
  function toggleMobileMenu(state: boolean | undefined = undefined): void {
    isShowingMobileMenu.value = state ?? !isShowingMobileMenu.value;
  }

  /**
   * Clears all cookies.
   */
  function clearAllCookies(): void {
    if (!import.meta.client) return;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  /**
   * Clear all local storage.
   */
  function clearAllLocalStorage(): void {
    if (!import.meta.client) return;
    localStorage.clear();
  }

  /**
   * Replaces a query parameter in a URL.Replace a query parameter in a URL
   * @param {string} param - The query parameter to replace.
   * @param {string} newval - The new value for the query parameter.
   * @param {string} search - The URL to search.
   * @returns {string} The updated URL.
   */
  function replaceQueryParam(param: string, newval: string, search: string): string {
    const regex = new RegExp('([?;&])' + param + '[^&;]*[;&]?');
    const query = search.replace(regex, '$1').replace(/&$/, '');
    return (query.length > 2 ? query + '&' : '?') + (newval ? param + '=' + newval : '');
  }

  /**
   * Removes a class from the body element.
   * @param {string} className - The class to remove.
   */
  function removeBodyClass(className: string): void {
    if (!import.meta.client) return;
    const body = document.querySelector('body');
    body?.classList.remove(className);
  }

  /**
   * Adds a class to the body element.
   * @param {string} className - The class to add.
   */
  function addBodyClass(className: string): void {
    if (!import.meta.client) return;
    const body = document.querySelector('body');
    body?.classList.add(className);
  }

  /**
   * Toggles a class on the body element.
   * @param {string} className - The class to toggle.
   */
  function toggleBodyClass(className: string): void {
    if (!import.meta.client) return;
    const body = document.querySelector('body');
    body?.classList.contains(className) ? body.classList.remove(className) : body?.classList.add(className);
  }

  /**
   * Determines if the route query is empty.
   * @returns {boolean} True if the route query is empty, false otherwise.
   */
  const isQueryEmpty = computed<boolean>(() => Object.keys(route.query).length === 0);

  /**
   * Formats a date string.
   * @param {string} date - The date string to format.
   * @returns {string} The formatted date string.
   */
  const formatDate = (date?: string | null): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  /**
   * Formats a price string.
   * @param {string} price - The price string to format.
   * @returns {string} The formatted price string.
   */
  const formatPrice = (price: string): string => {
    const runtimeConfig = useRuntimeConfig();
    const currencyCode = runtimeConfig.public?.CURRENCY_CODE || 'USD';
    return parseFloat(price).toLocaleString('en-US', { style: 'currency', currency: currencyCode });
  };

  /**
   * Scrolls to the top of the page.
   */
  const scrollToTop = () => {
    if (!import.meta.client) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Strips HTML tags from a string.
   * @param {string} str - The string to strip.
   * @returns {string} The stripped string.
   */
  const stripHtml = (str: string | null | undefined = ''): string => {
    return str === null ? '' : str.replace(/(<([^>]+)>)/gi, '');
  };

  /**
   * Debounces a function.
   * @param {Function}
   * @param {number} delay - The delay in milliseconds.
   * @returns {Function} The debounced function.
   */
  const debounce = (func: Function, delay: number = 100) => {
    let inDebounce: NodeJS.Timeout;
    return function (this: any, ...args: any[]) {
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(this, args), delay);
    };
  };

  type GqlErrorMessage = { message?: string | null };
  type GqlErrorLike = { gqlErrors?: GqlErrorMessage[] };

  const isGqlErrorLike = (value: unknown): value is GqlErrorLike => {
    return typeof value === 'object' && value !== null && 'gqlErrors' in value;
  };

  /**
   * Extract GraphQL error message and optionally log it
   * @param error - GraphQL error object
   * @returns The error message or undefined
   */
  const getErrorMessage = (error: unknown): string | undefined => {
    const errorMessage = isGqlErrorLike(error) ? (error.gqlErrors?.[0]?.message ?? undefined) : undefined;

    // Check for server errors that require clearing cookies and reloading
    const serverErrors = ['The iss do not match with this server', 'Invalid session token', 'expired token', 'invalid-secret-key'];
    const shouldClearAndReload = serverErrors.some((serverError) => errorMessage?.toLowerCase().includes(serverError.toLowerCase()));

    if (shouldClearAndReload && import.meta.client) {
      clearAllCookies();
      window.location.reload();
    }

    return errorMessage;
  };

  /**
   * Check GraphQL response extensions for authentication errors
   * This handles cases where WordPress returns 403 with valid data but auth errors in extensions.debug
   * @param response - GraphQL response object that may contain extensions.debug array
   */
  const checkGraphQLExtensions = (response: any): void => {
    if (!import.meta.client) return;
    const debugMessages = response?.extensions?.debug;
    if (!Array.isArray(debugMessages)) return;

    const serverErrors = ['invalid-secret-key', 'expired token', 'Invalid session token'];
    const hasAuthError = debugMessages.some((debug: any) =>
      serverErrors.some((serverError) => debug?.message?.toLowerCase().includes(serverError.toLowerCase())),
    );

    if (hasAuthError) {
      console.warn('Authentication error detected in GraphQL response extensions. Clearing cookies and reloading...');
      clearAllCookies();
      clearAllLocalStorage();
      window.location.reload();
    }
  };

  /**
   * Get domain from URL
   * @param {string} url - The URL to get the domain from.
   * @returns {string} The domain.
   */
  const getDomain = (url: string): string => {
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match !== null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
      return match[2];
    }
    return '';
  };

  return {
    isShowingMobileMenu,
    wooNuxtVersionInfo,
    productsPerPage,
    isQueryEmpty,
    wooNuxtSEO,
    frontEndUrl,
    isDev,
    checkGraphQLExtensions,
    FALLBACK_IMG,
    clearAllCookies,
    clearAllLocalStorage,
    replaceQueryParam,
    addBodyClass,
    removeBodyClass,
    toggleBodyClass,
    toggleMobileMenu,
    formatDate,
    formatPrice,
    scrollToTop,
    stripHtml,
    debounce,
    getErrorMessage,
    getDomain,
  };
}

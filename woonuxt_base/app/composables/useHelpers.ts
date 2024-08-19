import pkg from '../../../woonuxt_base/package.json';

// A collection of helper functions.
export function useHelpers() {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();

  const isShowingMobileMenu = useState<boolean>('isShowingMobileMenu', () => false);
  const wooNuxtVersionInfo: string = pkg.version || '0.0.0';
  const productsPerPage: number = runtimeConfig.public?.PRODUCTS_PER_PAGE || 24;
  const wooNuxtSEO = runtimeConfig.public?.WOO_NUXT_SEO as WooNuxtSEOItem[];
  const frontEndUrl = runtimeConfig.public?.FRONT_END_URL?.replace(/\/$/, '') || null;
  const isDev: boolean = process.env.NODE_ENV === 'development';
  const FALLBACK_IMG = '/images/placeholder.jpg';

  /**
   * Toggles the mobile menu.
   */
  function toggleMobileMenu(state: boolean | undefined = undefined): void {
    isShowingMobileMenu.value = state ?? !isShowingMobileMenu.value;
  }

  /**
   * Formats an array of variation objects by removing spaces and hyphens from the 'name' and 'value' properties.
   * @param {any[]} arr - The array of variation objects to format. Each object should have 'name' and 'value' properties.
   * @returns {any[]} The formatted array of variation objects.
   */
  const formatVariationArrays = (arr: any[]): any[] => arr.map((a) => ({ name: a.name.replace(/[-\s]/g, ''), value: a.value.replace(/[-\s]/g, '') }));

  /**
   * Determines if two arrays of variations are equal by comparing the formatted arrays.
   * @param {any[]} a1 - The first array of variations to compare.
   * @param {any[]} a2 - The second array of variations to compare.
   * @returns {boolean} True if the arrays are equal, false otherwise.
   */
  const arraysEqual = (a1: any[], a2: any[]): boolean => JSON.stringify(formatVariationArrays(a1)) === JSON.stringify(formatVariationArrays(a2));

  // Formats an array of variations by converting the name and value properties to lowercase.
  const formatArray = (arr: any[]): any[] => {
    return arr.map((v) => {
      let name = v.name.toLowerCase();
      name = name.startsWith('pa_') ? name.replace('pa_', '') : name;
      const value = v.value.toLowerCase();
      return { name, value };
    });
  };

  /**
   * Clears all cookies.
   */
  function clearAllCookies(): void {
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
    const body = document.querySelector('body');
    body?.classList.remove(className);
  }

  /**
   * Adds a class to the body element.
   * @param {string} className - The class to add.
   */
  function addBodyClass(className: string): void {
    const body = document.querySelector('body');
    body?.classList.add(className);
  }

  /**
   * Toggles a class on the body element.
   * @param {string} className - The class to toggle.
   */
  function toggleBodyClass(className: string): void {
    const body = document.querySelector('body');
    body?.classList.contains(className) ? body.classList.remove(className) : body?.classList.add(className);
  }

  /**
   * Checks for variation type of 'any' and returns an array of the indexes of those variations.
   * @param {Product} product - The product to check.
   * @returns {number[]} An array of the indexes of variations with a type of 'any'.
   */
  const checkForVariationTypeOfAny = (product: Product): number[] => {
    const numberOfVariation = product?.attributes?.nodes?.length ?? 0;
    let indexOfTypeAny = [] as number[];

    for (let index = 0; index < numberOfVariation; index++) {
      const tempArray = [] as string[];
      product.variations?.nodes.forEach((element) => {
        // @ts-ignore
        if (element.attributes?.nodes[index]?.value) tempArray.push(element.attributes.nodes[index].value);
      });

      if (!tempArray.some(Boolean)) indexOfTypeAny.push(index);
    }

    return indexOfTypeAny;
  };

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
  const formatPrice = (price: string): string => parseFloat(price).toLocaleString('en-US', { style: 'currency', currency: 'EUR' });

  /**
   * Scrolls to the top of the page.
   */
  const scrollToTop = () => {
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

  /**
   *  Logs a GraphQL error message. Only show logs in development or when the 'debug' query parameter is present.
   * @param error
   */
  const logGQLError = (error: any) => {
    if (!isDev && !route.query.debug) return;
    const errorMessage = error?.gqlErrors?.[0]?.message;
    if (errorMessage) {
      console.error(errorMessage);
    }
  };

  return {
    isShowingMobileMenu,
    wooNuxtVersionInfo,
    productsPerPage,
    isQueryEmpty,
    wooNuxtSEO,
    frontEndUrl,
    isDev,
    FALLBACK_IMG,
    formatArray,
    arraysEqual,
    clearAllCookies,
    clearAllLocalStorage,
    replaceQueryParam,
    addBodyClass,
    removeBodyClass,
    toggleBodyClass,
    toggleMobileMenu,
    checkForVariationTypeOfAny,
    formatDate,
    formatPrice,
    scrollToTop,
    stripHtml,
    debounce,
    logGQLError,
  };
}

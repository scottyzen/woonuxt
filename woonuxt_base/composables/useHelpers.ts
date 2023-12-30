// A collection of helper functions.
export function useHelpers() {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();

  const isShowingMobileMenu = useState<boolean>('isShowingMobileMenu', () => false);
  const wooNuxtVersionInfo: string = runtimeConfig.public.version || '0.0.0';
  const productsPerPage: number = runtimeConfig.public.PRODUCTS_PER_PAGE || 24;
  let hasnextpage = false;
  let pageafter = "";
  let pagebefor = "";
  let firstpage = "";

  function updatehaspageInfo(newhasnextpage: boolean | false, newpageafter: string | "", newpagebefor: string | ""): void{ 
    pagebefor = newpagebefor ;
    pageafter = newpageafter ;
    hasnextpage = newhasnextpage ;
  }

  function updatefirstpage(newfirstpage: string | ""): void{ 
    firstpage = newfirstpage ;
  }

  function toggleMobileMenu(state: boolean | undefined = undefined) {
    isShowingMobileMenu.value = state ?? !isShowingMobileMenu.value;
  }

  // Formats the given variation array by replacing all dashes and spaces in the name and value properties with underscores.
  function formatVariationArrays(arr: any[]): any[] {
    return arr.map((a) => {
      // replace all dashes and spaces with underscores
      return {
        name: a.name.replace(/[-\s]/g, ''),
        value: a.value.replace(/[-\s]/g, ''),
      };
    });
  }

  // Determines if two arrays of variations are equal
  function arraysEqual(a1: any[], a2: any[]): boolean {
    const a1Formatted = formatVariationArrays(a1);
    const a2Formatted = formatVariationArrays(a2);
    return JSON.stringify(a1Formatted) === JSON.stringify(a2Formatted);
  }

  // Formats an array of variations by converting the name and value properties to lowercase.
  const formatArray = (arr: any[]): any[] => {
    return arr.map((v) => {
      let name = v.name.toLowerCase();
      name = name.startsWith('pa_') ? name.replace('pa_', '') : name;
      const value = v.value.toLowerCase();
      return { name, value };
    });
  };

  // Clear all cookies
  function clearAllCookies(): void {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  // Replace a query parameter in a URL
  function replaceQueryParam(param: string, newval: string, search: string): string {
    const regex = new RegExp('([?;&])' + param + '[^&;]*[;&]?');
    const query = search.replace(regex, '$1').replace(/&$/, '');
    return (query.length > 2 ? query + '&' : '?') + (newval ? param + '=' + newval : '');
  }

  function removeBodyClass(className: string): void {
    const body = document.querySelector('body');
    body?.classList.remove(className);
  }

  function addBodyClass(className: string): void {
    const body = document.querySelector('body');
    body?.classList.add(className);
  }

  function toggleBodyClass(className: string): void {
    const body = document.querySelector('body');
    body?.classList.contains(className) ? body.classList.remove(className) : body?.classList.add(className);
  }

  const checkForVariationTypeOfAny = (product: Product): number[] => {
    const numberOfVariation = product?.attributes?.nodes?.length || 0;
    let indexOfTypeAny = [] as number[];
    for (let index = 0; index < numberOfVariation; index++) {
      const tempArray = [] as string[];
      product.variations?.nodes.forEach((element) => {
        if (element.attributes?.nodes[index]?.value) tempArray.push(element.attributes.nodes[index].value as string);
      });

      if (!tempArray.some(Boolean)) indexOfTypeAny.push(index);
    }

    return indexOfTypeAny;
  };

  const formatURI = (str: string): string => decodeURIComponent(str);

  const isQueryEmpty = computed<boolean>(() => Object.keys(route.query).length === 0);

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    isShowingMobileMenu,
    wooNuxtVersionInfo,
    productsPerPage,
    isQueryEmpty,
    hasnextpage,
    pageafter,
    pagebefor,
    firstpage,
    formatArray,
    arraysEqual,
    clearAllCookies,
    replaceQueryParam,
    addBodyClass,
    removeBodyClass,
    toggleBodyClass,
    toggleMobileMenu,
    checkForVariationTypeOfAny,
    formatURI,
    formatDate,
    scrollToTop,
    updatehaspageInfo,
    updatefirstpage,
  };
}
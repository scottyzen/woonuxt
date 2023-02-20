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
function clearAllCookies() {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

// Replace a query parameter in a URL
function replaceQueryParam(param: string, newval: string, search: string) {
  const regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
  const query = search.replace(regex, "$1").replace(/&$/, '');
  return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
}

function toggleBodyClass(className: string) {
  const body = document.querySelector('body');
  if (body?.classList.contains(className)) {
    body.classList.remove(className);
  } else {
    body?.classList.add(className);
  }
}
function removeBodyClass(className: string) {
  const body = document.querySelector('body');
  if (body?.classList.contains(className)) {
    body.classList.remove(className);
  }
}

// A collection of helper functions.
export function useHelpers() {
  return { formatArray, arraysEqual, clearAllCookies, replaceQueryParam, toggleBodyClass, removeBodyClass };
}

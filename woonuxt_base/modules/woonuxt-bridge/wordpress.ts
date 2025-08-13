import { $fetch } from 'ofetch';

/**
 * Fetch WooNuxt settings from WordPress GraphQL endpoint
 */
export async function fetchWoonuxtSettings(gqlHost: string): Promise<any> {
  // Check plugin version first
  const versionQuery = `query getVersion {
    woonuxtSettings {
      wooCommerceSettingsVersion
    }
  }`;

  let pluginVersion = 0;
  try {
    const { data: versionData } = await $fetch(gqlHost, {
      method: 'POST',
      body: {
        query: versionQuery,
      },
    });

    pluginVersion = versionData?.woonuxtSettings?.wooCommerceSettingsVersion || 0;
  } catch (error) {
    // Silently fall back to version 0 if version check fails
    pluginVersion = 0;
  }

  // Build query based on version
  let settingsQuery: string;
  if (pluginVersion >= 1) {
    // Version 1+ supports all fields
    settingsQuery = `query getWooNuxtSettings {
      woonuxtSettings {
        wooCommerceSettingsVersion
        siteName
        shortDescription
        description
        siteImage
        baseUrl
        frontEndUrl
        backendUrl
        primary_color
        storeSettings {
          autoOpenCart
          showReviews
          showFilters
          showOrderByDropdown
          showSKU
          showRelatedProducts
          showProductCategoriesOnSingleProduct
          showBreadcrumbOnSingleProduct
          showMoveToWishlist
          hideBillingAddressForVirtualProducts
          initStoreOnUserActionToReduceServerLoad
          saleBadge
          socialLoginsDisplay
        }
        logo
        logo_width
        logo_height
        logo_mobile
        logo_mobile_width
        logo_mobile_height
        productsPerPage
        maxPrice
        currencyCode
        currencySymbol
        global_attributes
        wooNuxtSEO {
          title
          description
          ogImage
          isEnabled
        }
        stripePublishableKey
      }
    }`;
  } else {
    // Fallback for older versions or if version check fails
    settingsQuery = `query getWooNuxtSettings {
      woonuxtSettings {
        siteName
        shortDescription
        description
        baseUrl
        primary_color
        logo
        productsPerPage
        maxPrice
        currencyCode
        currencySymbol
      }
    }`;
  }

  try {
    const { data } = await $fetch(gqlHost, {
      method: 'POST',
      body: {
        query: settingsQuery,
      },
    });

    return data?.woonuxtSettings || {};
  } catch (error) {
    console.warn('WordPress endpoint unreachable, using defaults:', error);
    return {};
  }
}

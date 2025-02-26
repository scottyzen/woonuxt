import { defineAppConfig } from 'nuxt/app'

/**
 * App configuration.
 * This file is used to configure the app settings.
 * Below are the default values.
 */
export default defineAppConfig({
  siteName: 'ModaPrime USA',
  shortDescription: 'Fast and reliable modafinil delivery across the USA.',
  description: 'ModaPrime USA provides quality modafinil with rapid shipping and professional service. Experience streamlined ordering and efficient delivery.',
  baseUrl: 'https://store.modaprimeusa.com',
  siteImage: '/link-preview.png',
  storeSettings: {
    autoOpenCart: true,
    showReviews: false,
    showFilters: false,
    showOrderByDropdown: true,
    showSKU: false,
    showRelatedProducts: true,
    showProductCategoriesOnSingleProduct: false,
    showBreadcrumbOnSingleProduct: true,
    showMoveToWishlist: false,
    hideBillingAddressForVirtualProducts: true,
    initStoreOnUserActionToReduceServerLoad: true,
    saleBadge: 'percent',
    socialLoginsDisplay: 'buttons',
  },
})

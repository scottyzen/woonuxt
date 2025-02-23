/**
 * App configuration.
 * This file is used to configure the app settings.
 * Below are the default values.
 */
export default defineAppConfig({
  siteName: 'WooNuxt',
  shortDescription: 'ModaPrime USA - Fast shipping and competitive prices across the United States.',
  description: `ModaPrime USA is committed to providing high-quality products with exceptional customer service. We focus on customer satisfaction through competitive pricing, rapid delivery, and reliable support.`,
  baseUrl: 'https://store.modaprimeusa.com',
  siteImage: '/images/siteimg.png',
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
    saleBadge: 'percent', // 'percent', 'onSale' or 'hidden'
    socialLoginsDisplay: 'buttons', // 'buttons' or 'icons'
  },
});

/**
 * App configuration.
 * This file is used to configure the app settings.
 * Below are the default values.
 */
export default defineAppConfig({
  siteName: 'WooNuxt',
  shortDescription: 'ModaPrime USA - Premium modafinil with fast shipping and competitive prices across the United States.',
  description: `ModaPrime USA is committed to providing high-quality modafinil products with exceptional customer service. We focus on customer satisfaction through competitive pricing, rapid delivery, and reliable support.`,
  baseUrl: 'https://store.modaprimeusa.com',
  siteImage: 'https://user-images.githubusercontent.com/5116925/218879668-f4c1f9fd-bef4-44b0-bc7f-e87d994aa3a1.png',
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

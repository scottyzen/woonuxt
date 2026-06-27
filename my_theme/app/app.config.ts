/**
 * App configuration.
 * This file is used to configure the app settings.
 * Below are the default values.
 */
export default defineAppConfig({
  siteName: 'Acsweet Jewelry',
  shortDescription: 'ACSweet Jewelry is an online fine jewelry store. It provides a modern, fast, and seamless shopping experience for stylish, confident women who believe affordable luxury should be part of every day.',
  description: `ACSweet Jewelry offers fine jewelry that blends fashion-forward design with everyday affordability. We believe confidence shouldn't cost a fortune — just a touch of elegance for the real you.`,
  baseUrl: 'https://www.acsweetjewelry.com',
  siteImage: 'https://user-images.githubusercontent.com/5116925/218879668-f4c1f9fd-bef4-44b0-bc7f-e87d994aa3a1.png',
  storeSettings: {
    autoOpenCart: false,
    // cartMode: 'optimistic' updates UI immediately; 'safe' waits for the server response.
    cartMode: 'optimistic',
    showReviews: true,
    showFilters: true,
    showOrderByDropdown: true,
    showSKU: true,
    showRelatedProducts: true,
    showProductCategoriesOnSingleProduct: true,
    showBreadcrumbOnSingleProduct: true,
    showMoveToWishlist: true,
    hideBillingAddressForVirtualProducts: false,
    initStoreOnUserActionToReduceServerLoad: true,
    saleBadge: 'percent', // 'percent', 'onSale' or 'hidden'
    socialLoginsDisplay: 'buttons', // 'buttons' or 'icons'
  },
});

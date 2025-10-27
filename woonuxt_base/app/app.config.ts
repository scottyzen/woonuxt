/**
 * App configuration.
 * This file is used to configure the app settings.
 * Below are the default values.
 */
export default defineAppConfig({
  siteName: 'KledingZoeken.nl',
  shortDescription: 'Kledingzoeken.nl verzamelt kleding van alle bekende merken uit diverse webshops. Vergelijk eenvoudig prijzen, ontdek aanbiedingen en vind snel jouw favoriete stijl. Wij verkopen niets zelf, maar helpen je slim shoppen.',
  description: `Kledingzoeken.nl is hét platform waar je kleding van bekende merken vindt, verzameld uit meerdere webshops. Vergelijk prijzen, ontdek actuele aanbiedingen en filter eenvoudig op merk, maat of stijl. Wij verkopen niets zelf, maar helpen je de beste deal te vinden en slim te shoppen.`,
  baseUrl: 'https://www.kledingzoeken.nl',
  siteImage: 'https://www.kledingzoeken.nl/images/social-share.png',
  stripePaymentMethod: 'payment', // 'card' of 'payment'
  // Betaalmethode-opties (indien van toepassing bij partnershops):
  // - 'card': Traditioneel invoerveld voor één kaart (verouderd maar nog ondersteund)
  // - 'payment': Moderne betaaloptie met tabbladen voor meerdere betaalmethoden (aanbevolen)
  storeSettings: {
    autoOpenCart: false,
    showReviews: true,
    showFilters: true,
    showOrderByDropdown: true,
    showSKU: false,
    showRelatedProducts: true,
    showProductCategoriesOnSingleProduct: true,
    showBreadcrumbOnSingleProduct: true,
    showMoveToWishlist: true,
    hideBillingAddressForVirtualProducts: true,
    initStoreOnUserActionToReduceServerLoad: true,
    saleBadge: 'percent', // 'percent', 'onSale' of 'hidden'
    socialLoginsDisplay: 'buttons', // 'buttons' of 'icons'
  },
});


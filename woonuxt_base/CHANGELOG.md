# Change Log

All notable changes to this project will be documented in this file. I'll try my best to keep it updated.

## v4.18.1 (26-04-2026)

- refactor: Removed optimistic cart mutation flow from base `useCart` to simplify state management and keep cart UI fully server-driven
- refactor: Simplified cart loading state handling by relying on `isUpdatingCart` as the single mutation state
- fix: Product page add-to-cart flow now treats products with no price as unavailable and prevents add-to-cart attempts
- ui: Single-product add-to-cart button/loading logic simplified after cart state refactor

## v4.17.0 (19-04-2026)

- feature: Saved card checkout — logged-in users can now pay with a previously saved card without re-entering card details
- feature: Saved cards displayed at the top of the payment section with radio selection; "Use another payment method" link to switch to a new card
- feature: `savedPaymentMethods` field on the GraphQL `User` type, exposing token id, last4, expiry, card type, default flag, and the owning Stripe customer ID sourced directly from the WooCommerce payment token (not stale user meta)
- feature: `customerSessionClientSecret` on `stripePaymentIntent` response, enabling Stripe Elements to display saved methods in the Payment Element
- fix: Stripe "payment_method belongs to Customer" error — PaymentIntent for a saved card now always uses the customer ID stored on the token itself, bypassing stale `wc_stripe_customer` user meta
- fix: Logout now navigates immediately and fires `refreshCart` in the background, preventing a stale cart from persisting on screen
- fix: `emptyCart` optimistic mutation now awaits the server round-trip before finalising, preventing a race condition where the cart could reappear
- fix: `clearAllCookies` now expires cookies at `path=/` and both hostname and root-domain variants, ensuring WooCommerce session cookies are fully cleared on logout
- fix: `formatPrice` now handles `number`, `null`, and `undefined` inputs and strips HTML/currency symbols before parsing, eliminating `€NaN` renders on the order summary page
- fix: Order summary item totals rendered via `v-html` so WooCommerce-formatted price strings (which include HTML) display correctly
- fix: Shipping address fallback in `ensureShippingRates` now correctly detects an empty `{}` shipping object and falls back to billing rather than treating it as populated
- fix: `StripeElement` recreates itself when `customerSessionClientSecret` changes, so the Payment Element reflects the customer's saved methods after async load
- fix: `AttributeSelections` radio outline scoped to `.attribute-selections` to prevent bleed into other radio inputs on the page
- chore: `ShippingOptions` no longer reads `CURRENCY_SYMBOL` from runtime config (shipping rates already include formatted price strings from WooCommerce)
- chore: `downloadUrl` field commented out of `DownloadableItem` fragment (field removed in recent WPGraphQL versions)
- chore: Trailing whitespace cleaned up across `AttributeSelections.vue`

## v4.14.0 (07-02-2026)

- chore: Consolidate GraphQL types under `#types/gql` and enums under `#gql/default`
- refactor: Split product types for detail vs list queries and tighten null handling across product UI
- fix: Improve GraphQL error handling and SSR-safe helpers
- fix: Align checkout/address typing and optional state handling for shipping updates
- chore: Add Nuxt/Vue SFC typecheck script for CI and local validation

## v4.13.0 (29-01-2026)

- feature: Attribute selection overhaul with centralized selection model and variation matching (#348)
- fix: Resolve invalid/partial selections by auto-adjusting compatible options
- ui: Disable unavailable attribute options and add contextual selection hints

## v4.12.0 (27-01-2026)

- fix: Sync billing/shipping address updates during checkout (#346)
- ui: Standardize form styling with `.wn-form` and `.select` classes (#347)
- ui: Improve dark mode consistency for form inputs and selects

## v4.11.0 (26-01-2026)

- feature: Product card image slider for variation previews (#344)
- feature: Smart variation pre-selection via filter-aware links and query params (#345)
- fix: Preserve selected variation on product page and in shared URLs

## v4.0.16 (22-07-2024)`

- feature: Add option showMoveToWishlist #192
- feature: Add browse product button to empty cart #194
- feature: Add autoComplete to multiple forms #200
- refactor: Reduce the number of API call on checkout page
- fix: Order terms order #191
- fix: link in lost-password #195
- fix: Initial country value for states #197
- chore: Add @nuxt/icon module for icon support
- chore: Update ShippingOptions component with currency symbol from runtime config
- chore: Update npm dependencies to latest versions
- chore: Update `.env.example` #190
- chore: Refactor QuantityInput component
- chore: Other minor improvements and bug fixes

## v4.0.6 (4-07-2024)`

- Add user avatar and email to sidebar of account page
- Add Wishlist to my account page
- Add ResetPassword from email #180
- Add new Nuxt `compatibilityDate`

## v4.0.5 (4-07-2024)

- Handle server errors in useGqlError callback
- Improve order summary page layout and styling
- Add null check for date in formatDate function
- Better TypeScript types in index.d.ts
- Add error logging for GraphQL queries in useAuth.ts
- Updated queries & fragment

## v4.0.4 (4-07-2024)

- Fix downloadable products not showing on the correct order summary page

## v4.0.3 (1-07-2024)

- Add Downloads List #177
- Add option to show/hide Breadcrumb on SingleProduct #181

## v4.0.2 (29-06-2024)

- Add more options to `app.config.ts` #178

## v4.0.1 (26-06-2024)

- Add option showReviews #176
- Update `nuxt-graphql-client` to v0.2.35

## v4.0.0 (19-06-2024)

- Enable Nuxt 4 compatibility option in `nuxt.config.js`
- Updated folder structure to new `app` directory. See [New Directory Structure](https://nuxt.com/docs/getting-started/upgrade#new-directory-structure)
- Update dependencies
- Add `app.config.ts` with some default values. Note, this will be expanded in future versions to include more configuration options.
- App Popular products section to the home page
- Minor TS improvements
- Add `#constants` and `#gql` aliases to `nuxt.config.js`. The `#gql/default` path is useful for importing WooCommerce GraphQL types and enums generated by `nuxt-graphql-client` codegen.
- WooNuxt v3 will still be available in the [v3 branch](https://github.com/scottyzen/woonuxt/tree/v3)

# 3.6.2 (20-05-2024)

Add `AUTO_OPEN_CART` to `.env` to automatically open the cart when adding a product to the cart.

# 3.6.1 (17-05-2024)

## CHANGES

- Handle login error and improve error message in `useAuth.ts`
- Remove `formatURI` function
- Minor TypeScript improvements
- Update checkout page to use TypeScript in script setup block
- Add `logGQLError` & `clearAllLocalStorage` helper functions
- Update npm dependencies for `@nuxt/image` and `@stripe/stripe-js`

# 3.6.0 (27-04-2024)

## CHANGES

- Updated dependencies
- Fix images not loading on Netlify
- Add users avatar to the header when logged in
- Add placeholder fot category and product images
- Add basic `error.vue` page

# 3.5.0

## CHANGES (19-04-2024)

- Update styling of PriceFilter component
- Switch slider to Primevue
- Update hover text color in Filters component
- Add keep-alive to NuxtPage (Improves DX)
- fetchAllProducts to get all products
- Updated dependencies

## 3.4.27 (06-04-2024)

### Bug Fixes

- The default variation is now respected. Also, if there are no defaults set, the first of each attribute is selected. IMO I think that is better than having the user select the first option for each attribute. [#141](https://github.com/scottyzen/woonuxt/issues/141)

## 3.4.26 (06-04-2024)

### Bug Fixes

- Fix bug where a product variation that wasn't available was able to be added to the cart.
- Product gallery showing not all variations and won't change image [#139](https://github.com/scottyzen/woonuxt/issues/139)

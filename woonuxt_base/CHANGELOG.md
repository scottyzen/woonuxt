# Change Log

All notable changes to this project will be documented in this file. I'll try my best to keep it updated.

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

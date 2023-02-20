![full](https://user-images.githubusercontent.com/5116925/218879668-f4c1f9fd-bef4-44b0-bc7f-e87d994aa3a1.png)

# Next Generation Front-End for WooCommerce

> **Note** This is the first iteration of the new WooNuxt built on Nuxt 3. It's under active development and has a lot of features still to be added. You can use the old version of WooNuxt on the [v2 branch](https://github.com/scottyzen/woonuxt/tree/v2) which is more stable.

## Introduction

The goal of WooNuxt is to provide a modern, fast, and SEO friendly front-end for WooCommerce. It's built on top of Nuxt 3 and uses the WPGraphQL API to retrieve all the data it needs. It's also fully customizable and can be extended with your own components and modules. You can see a live demo of WooNuxt by clicking the button below.

[Live Demo of WooNuxt](https://v3.woonuxt.com/) ⚡️

## Get Started

- Download the [WooNuxt Settings](https://github.com/scottyzen/woonuxt-settings/releases/download/1.0.8/woonuxt-settings.zip) plugin.
- Install and activate the plugin on your WordPress site. This will install all the required plugins for WooNuxt, add some useful fields to the WPGraphQL schema, and automatically retrieve the WooCommerce payment gateway settings for Stripe and PayPal.
- Once the plugin is activated your ready to deploy WooNuxt on a whatever hosting you like, or click one onf the fast deploy button below.

[![button](https://user-images.githubusercontent.com/5116925/218880214-a16287a7-fd8c-4299-9e65-0871136f0771.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/scottyzen/woonuxt)

### Progress

- Speed ✅
- SEO
- Cart ✅
- Search ✅
- Shipping ✅
- Checkout
  - Stripe ✅
  - Paypal ✅
  - Cash on Delivery ✅
- Filtering ✅
- Wishlists ✅
- Account ✅
- Coupons ✅

### Required WordPress Plugins

- [WPGraphQL](https://www.wpgraphql.com)
- [WooGraphQL](https://woographql.com)
- [WPGraphQL Cors](https://github.com/funkhaus/wp-graphql-cors)

#### Tested up to:

- WordPress 6.1.1
- WooCommerce 7.1.1
- WPGraphQL 1.13.7
- WooGraphQL 0.12.0
- Node 16.18.1

### Todos

- Product Reviews
- product Category Pages
- WooNuxt Settings - Module
- Better Typescript Support
- Mobile layout

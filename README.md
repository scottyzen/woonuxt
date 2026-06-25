![full](https://user-images.githubusercontent.com/5116925/218879668-f4c1f9fd-bef4-44b0-bc7f-e87d994aa3a1.png)

# Next Generation Front-End for WooCommerce

## Introduction

The goal of WooNuxt is to provide a modern, fast, and SEO-friendly front-end for WooCommerce. It's built on Nuxt 3 and uses the WPGraphQL API to retrieve all the data it needs. It's also fully customizable and can be extended with your custom components and modules. You can see a live demo of WooNuxt by clicking the button below.

| Demo            | URL                            |
| --------------- | ------------------------------ |
| Netlify Demo    | https://v3.woonuxt.com/        |
| Vercel Demo     | https://woonuxt-v3.vercel.app/ |
| NuxtHub Demo    | https://woo.nuxt.dev/          |
| Customized Demo | https://myshop.woonuxt.com/    |

## Troubleshooting

You can find some common errors and how to fix them [here](https://woonuxt.com/faq#some-common-errors-to-troubleshoot)

## Get Started

- Download the latest WooNuxt Settings plugin from the [woonuxt-settings releases](https://github.com/scottyzen/woonuxt-settings/releases).
- Install and activate the plugin on your WordPress site. This will install all the required plugins for WooNuxt, add some useful fields to the WPGraphQL schema, and automatically retrieve the WooCommerce payment gateway settings for [Stripe](https://wordpress.org/plugins/woocommerce-gateway-stripe/) and [PayPal](https://woo.com/document/paypal-standard/).
- Once the plugin is activated you are ready to deploy WooNuxt on whatever hosting you like or click one of the fast deploy buttons below.
- Once the plugin is activated, configure `GQL_HOST` and `NUXT_IMAGE_DOMAINS`. Check out the `.env.example` file for details.

[![button](https://user-images.githubusercontent.com/5116925/218880214-a16287a7-fd8c-4299-9e65-0871136f0771.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/scottyzen/woonuxt) [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fscottyzen%2FWooNuxt3&repository-name=WooNuxt&env=GQL_HOST,NUXT_IMAGE_DOMAINS)
[![Deploy to PandaStack](https://dashboard.pandastack.io/deploy-button.svg)](https://dashboard.pandastack.io/deploy?repo=scottyzen/woonuxt&type=static&buildCmd=npm+run+build&outputDir=dist)

## Large Catalog ISR Setup (10K+ Products)

For large catalogs, avoid full static generation and use Nuxt hybrid rendering with ISR.

- Build with `nuxt build` (not `nuxt generate`).
- Product catalog routes use Nitro `routeRules` with `isr` in `nuxt.config.ts`.
- Default revalidation window is 3600 seconds and can be overridden via `CATALOG_ISR_TTL`.

How ISR gets triggered:

- The first request to a route (for example `/product/some-slug`) generates the page and caches it.
- Requests during the TTL are served from cache.
- After TTL, the next request serves stale content and triggers background regeneration.

Platform notes:

- Vercel: uses Nuxt/Nitro ISR route rules directly.
- Netlify: use server build mode (`nuxt build`) so route rules can run on the serverless/edge runtime. Static generate mode (`nuxt generate`) bypasses ISR.

## Session Init Performance

WooNuxt avoids loading the full WooCommerce session for every visitor on first paint. This keeps cached catalog pages fast, reduces unnecessary WPGraphQL traffic, and still gives returning customers a responsive account/cart header.

The default flow is:

- Anonymous first visit: no backend session/cart call is made until the visitor interacts with the page.
- Returning or logged-in user: WooNuxt detects existing auth/session cookies and makes a small immediate `getCartSummary` request so the avatar and cart badge can appear quickly.
- Full cart accuracy: the full `getCart` request is loaded only when the customer needs it, such as opening the cart drawer, visiting cart/checkout/account routes, or changing cart contents.

This is controlled by `storeSettings.initStoreOnUserActionToReduceServerLoad` in `woonuxt_base/app/app.config.ts`. Keep it enabled for high-traffic storefronts. Disable it if your store prefers immediate full cart hydration over reducing backend calls.

## How to customize & extend WooNuxt 🎨

WooNuxt now uses the Nuxt layers feature to make it easy to customize any part of WooNuxt just like you would with a WordPress theme with its child theme.

Example: I have created a pages directory and added a `contact.vue` file in the pages directory. This will override the default contact page that comes with WooNuxt. You can do this with any page or component. So think of the `woonuxt_base` folder as the parent theme and the root folder as the child theme.

Here is a [branch](https://github.com/scottyzen/woonuxt/tree/myshop) with an example of some basic customizations:
And here is the live demo of the customized WooNuxt site: [My Shop](https://myshop.woonuxt.com/).

### Nuxt layer customization example

The root project is the child layer, and `woonuxt_base/` is the parent layer. In `nuxt.config.ts` you should use a single `extends` property with an array of parent layers.

```ts
export default defineNuxtConfig({
  extends: ['./woonuxt_base'],
});
```

If you do have an extra custom layer folder, add it in the same array:

```ts
export default defineNuxtConfig({
  extends: ['./woonuxt_base', './my_theme'],
});
```

Do not add `extends:` twice in the same config file. A duplicate key will overwrite the first one and prevent the layer system from working correctly.

To override base files, copy the same path into your root project or custom layer. For example:

- `woonuxt_base/app/components/ProductCard.vue` → `app/components/ProductCard.vue`
- `woonuxt_base/app/pages/contact.vue` → `pages/contact.vue`

### Progress

### Location Hooks System 🪝

WooNuxt provides hook points where you can inject custom components without modifying core code. Perfect for adding trust badges, upsells, or custom messages.

**Quick example:**

```ts
// In your app or custom layer: hooks/product.ts
import TrustBadge from '~/components/TrustBadge.vue'

export default () => {
  registerHook({
    name: 'product.summary.afterPrice',
    id: 'trust-badge',
    component: TrustBadge
  })
}
```

Your component receives context as a prop:

```vue
<script setup>
defineProps<{ ctx: { product: any } }>()
</script>

<template>
  <div class="text-sm text-gray-600">✓ Secure & trusted</div>
</template>
```

**Available hook locations:**

- `layout.header.beforeNav` — Before header navigation
- `layout.footer.bottom` — Bottom of footer
- `product.summary.beforeTitle` — Before product title
- `product.summary.afterPrice` — After product price
- `product.tabs.after` — After product tabs
- `checkout.review.after` — After checkout review

For more examples and advanced usage, see the [Hooks documentation](https://github.com/scottyzen/WooNuxtGuide/blob/master/content/4.hooks/index.md).

| Feature                                                   | Ongoing Enhancements | In the Pipeline | In Progress | Done | Next |
| --------------------------------------------------------- | -------------------- | --------------- | ----------- | ---- | ---- |
| Performance                                               | 🔷                   |                 |             | ✅   |      |
| SEO                                                       | 🔷                   |                 | ✅          |      |      |
| Cart                                                      |                      |                 |             | ✅   |      |
| Search                                                    |                      |                 |             | ✅   |      |
| Shipping                                                  |                      |                 |             | ✅   |      |
| Checkout (Stripe, PayPal, Cash on Delivery)               | 🔷                   |                 |             | ✅   | 🔶   |
| Filtering                                                 | 🔷                   |                 |             | ✅   |      |
| Wishlists                                                 |                      |                 |             | ✅   |      |
| Account                                                   |                      |                 |             | ✅   |      |
| Coupons                                                   |                      |                 |             | ✅   |      |
| Product Reviews                                           |                      |                 | ✅          |      |      |
| Product Category Pages                                    |                      |                 | ✅          |      |      |
| WooNuxt Settings Module                                   | 🔷                   |                 | ✅          |      |      |
| Better TypeScript Support                                 | 🔷                   |                 | ✅          |      |      |
| Mobile layout                                             | 🔷                   |                 |             | ✅   |      |
| Countries & States Enums                                  |                      |                 |             | ✅   |      |
| Cookie Popup & GDPR Compliance                            |                      | ✅              |             |      |      |
| Progressive Web App (PWA)                                 |                      |                 | ✅          |      |      |
| Queuing System (for checking out when the server is busy) |                      | ✅              |             |      | 🔶   |
| Language Support (i18n)                                   | 🔷                   |                 | ✅          |      |      |

&nbsp;

### Required WordPress Plugins

| Plugin Name                                                                        | Description                              |
| ---------------------------------------------------------------------------------- | ---------------------------------------- |
| [WooCommerce](https://wordpress.org/plugins/woocommerce/)                          | Core eCommerce plugin                    |
| [WPGraphQL](https://www.wpgraphql.com/)                                            | A free, open-source plugin for WordPress |
| [WooGraphQL](https://woographql.com/)                                              | GraphQL API for WooCommerce              |
| ~~[WPGraphQL Cors](https://github.com/funkhaus/wp-graphql-cors)~~                  | ~~Enable CORS for WPGraphQL~~            |
| [Headless Login for WPGraphQL](https://github.com/AxeWP/wp-graphql-headless-login) | Enable headless login for WPGraphQL      |
| [woonuxt-settings.zip](https://github.com/scottyzen/woonuxt-settings/releases)     | WooNuxt Settings plugin                  |

> **Note** The [woonuxt-settings.zip](https://github.com/scottyzen/woonuxt-settings/releases) plugin will help you install all the required plugins.

&nbsp;

### Payment Methods

| Payment Method                                                      | Supported |
| ------------------------------------------------------------------- | --------- |
| [Stripe](https://wordpress.org/plugins/woocommerce-gateway-stripe/) | ✅        |
| [PayPal Standard](https://woo.com/document/paypal-standard/)        | ✅        |
| Cash on Delivery                                                    | ✅        |

### Required Environment Variables

- `GQL_HOST` - The GraphQL endpoint for your WordPress site, for example `https://wp.example.com/graphql`.
- `NUXT_IMAGE_DOMAINS` - The WordPress/CDN hostnames used for optimized images, for example `wp.example.com,cdn.example.com`.

The WooNuxt Settings plugin automatically provides the remaining storefront settings through GraphQL.

&nbsp;

### GraphQL Client Direction

WooNuxt uses a WooNuxt-owned GraphQL layer built on `graphql-request` and GraphQL Code Generator's `typescript-graphql-request` SDK.

This keeps the existing `.gql` files, generated operation types, and imperative storefront calls while avoiding a dependency on a Nuxt-specific GraphQL wrapper. Apollo is too heavy for WooNuxt's ISR-heavy catalog flow, urql's cache provides little value for the current architecture, and `gql.tada` would require a high-churn migration away from the existing query files.

Run `npm run graphql:codegen` after changing GraphQL queries or updating the WPGraphQL schema. The generated SDK is committed at `woonuxt_base/app/gql/default.ts` so the template can typecheck and build without relying on Nuxt's generated `.nuxt/gql` output.

&nbsp;

#### Tested up to:

| Plugin/Software              | Version |
| ---------------------------- | ------- |
| WordPress                    | 7.0.0   |
| WooCommerce                  | 10.8.1  |
| WPGraphQL                    | 2.16.0  |
| WooGraphQL                   | 1.0.2   |
| ~~WPGraphQL CORS~~           | ~~2.1~~ |
| Headless Login for WPGraphQL | 0.4.4   |
| Node                         | 22.22.2 |
| PHP                          | 8.4     |

### Current translations

| Language      | Code |
| ------------- | ---- |
| English 🇺🇸    | en   |
| German 🇩🇪     | de   |
| Spanish 🇪🇸    | es   |
| French 🇫🇷     | fr   |
| Italian 🇮🇹    | it   |
| Portuguese 🇵🇹 | pt   |

### Local SSL Setup

- Install [mkcert](https://github.com/FiloSottile/mkcert) on your machine.
- Run `mkcert localhost` to generate a certificate for localhost. You should now have a `localhost.pem` and `localhost-key.pem` file in your current directory. See the image below for an example.
- Then run `mkcert -install` to install the certificate authority.
- Finally, run `npm run dev:ssl` to start the dev server with SSL.

#### Credits

This is an ongoing project but it wouldn't be possible without the help of the following people: [Jason Bahl](https://github.com/jasonbahl) & [Geoffrey K Taylor](https://github.com/kidunot89) for their ongoing work on WPGraphQL and WooGraphQL respectively. Also, a big thanks to the Nuxt team for all their hard work making Nuxt 3 a pleasure to build upon. And the [WooCommerce](https://woocommerce.com/) team for making such a great e-commerce platform. Some other honorable mentions are [Funkhaus](https://funkhaus.us/) for their work on the WPGraphQL Cors plugin. And the people who have contributed to making WooNuxt better every day, [Alex Lykesas](https://github.com/alexookah), [Zack Hatlen](https://github.com/zackha), [Galli](https://github.com/Zielgestalt), [Guillaume](https://github.com/GuillaumeDgr) Thank you all! 🙏

I don't know where this project will go, but I'm excited to see what the future holds. If you have any questions or would like to contribute to the project please feel free to reach out to me on [X](https://x.com/scottyzen) or [GitHub](https://github.com/scottyzen).

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to get started.

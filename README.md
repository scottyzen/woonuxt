![full](https://user-images.githubusercontent.com/5116925/218879668-f4c1f9fd-bef4-44b0-bc7f-e87d994aa3a1.png)

# Next Generation Front-End for WooCommerce

## Introduction

The goal of WooNuxt is to provide a modern, fast, and SEO friendly front-end for WooCommerce. It's built on top of Nuxt 3 and uses the WPGraphQL API to retrieve all the data it needs. It's also fully customizable and can be extended with your own components and modules. You can see a live demo of WooNuxt by clicking the button below.

👉 [**Live Demo of WooNuxt**](https://v3.woonuxt.com/) ⚡️

&nbsp;

## Get Started

- Download the lates WooNuxt Settings (woonuxt-settings.zip) from the releases page here: [Releases](https://github.com/scottyzen/woonuxt-settings/releases)
- Install and activate the plugin on your WordPress site. This will install all the required plugins for WooNuxt, add some useful fields to the WPGraphQL schema, and automatically retrieve the WooCommerce payment gateway settings for Stripe and PayPal.
- Once the plugin is activated you are ready to deploy WooNuxt on whatever hosting you like or click one of the fast deploy buttons below.
- Once the plugin is activated the only required environment variable is `GQL_HOST`. Checkout the .env.example file for more details.

[![button](https://user-images.githubusercontent.com/5116925/218880214-a16287a7-fd8c-4299-9e65-0871136f0771.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/scottyzen/woonuxt) [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fscottyzen%2FWooNuxt3&repository-name=WooNuxt&env=GQL_HOST,NUXT_IMAGE_DOMAINS)

&nbsp;

## How to customize & extend WooNuxt 🎨

WooNuxt now uses the Nuxt layers feature to make it easy to customize any part of WooNuxt. Just like you would with a WordPress theme with it's child theme.

Example: I have created a pages directory and added a `contact.vue` file in the pages directory. This will override the default contact page that comes with WooNuxt. You can do this with any page or component. So think of the `woonuxt_base` folder as the parent theme and the root folder as the child theme.

&nbsp;

### Progress

| Feature                                                   | Ongoing Enhancements | In the Pipeline | In Progress | Done |
| --------------------------------------------------------- | -------------------- | --------------- | ----------- | ---- |
| Proformanance                                             | ✅                   |                 |             | ✅   |
| SEO                                                       |                      |                 | ✅          |      |
| Cart                                                      |                      |                 |             | ✅   |
| Search                                                    |                      |                 |             | ✅   |
| Shipping                                                  |                      |                 |             | ✅   |
| Checkout (Stripe, PayPay, Cash on Delivery)               |                      |                 |             | ✅   |
| Filtering                                                 | ✅                   |                 |             | ✅   |
| Wishlists                                                 |                      |                 |             | ✅   |
| Account                                                   |                      |                 | ✅          |      |
| Coupons                                                   |                      |                 |             | ✅   |
| Product Reviews                                           |                      |                 | ✅          |      |
| Product Category Pages                                    |                      |                 | ✅          |      |
| WooNuxt Settings Module                                   |                      |                 | ✅          |      |
| Better Typescript Supp                                    |                      |                 | ✅          |      |
| Mobile layout                                             | ✅                   |                 | ✅          |      |
| Countries & States Enums                                  |                      |                 |             | ✅   |
| Cookie Popup & GDPR Compliance                            |                      | ✅              |             |      |
| Progressive Web App (PWA)                                 |                      |                 | ✅          |      |
| Queuing System (for checking out when the server is busy) |                      | ✅              |             |      |
| Language Support (i18n)                                   |                      |                 | ✅          |      |

&nbsp;

### Required WordPress Plugins

| Plugin Name    | Description                              | Link                                        |
| -------------- | ---------------------------------------- | ------------------------------------------- |
| WPGraphQL      | A free, open-source plugin for WordPress | https://www.wpgraphql.com/                  |
| WooGraphQL     | GraphQL API for WooCommerce              | https://woographql.com/                     |
| WPGraphQL Cors | Enable CORS for WPGraphQL                | https://github.com/funkhaus/wp-graphql-cors |

> **Note** The the [woonuxt-settings.zip](https://github.com/scottyzen/woonuxt-settings/releases) plugin will help you install all the required plugins. WooGraphQL 0.13.0 and up is required to get the list of available countries and states. You can find the latest version of WooGraphQL [here](https://github.com/wp-graphql/wp-graphql-woocommerce/releases).

&nbsp;

### Required Environment Variables

`GQL_HOST` - The URL of your WordPress site. This is the only required environment variable.

&nbsp;


#### Tested up to:

| Plugin/Software | Version |
| --------------- | ------- |
| WordPress       | 6.3.1   |
| WooCommerce     | 8.0.3   |
| WPGraphQL       | 1.16.0  |
| WooGraphQL      | 0.15.0  |
| Node            | 16.18.1 |

### Current translations

| Language   | Code |
| ---------- | ---- |
| English 🇺🇸 | en   |
| German 🇩🇪  | de   |
| Spanish 🇪🇸 | es   |
| French 🇫🇷  | fr   |

#### Credits

This is an ongoing project but it wouldn't be possible without the help of the following people: [Jason Bahl](https://github.com/jasonbahl) & [Geoffrey K Taylor](https://github.com/kidunot89) for their ongoing work on WPGraphQL and WooGraphQL respectively. Also, a big thanks to the Nuxt team for all their hard work making Nuxt 3 a pleasure to build upon. And a big thanks to the [WooCommerce](https://woocommerce.com/) team for making such a great e-commerce platform. Some other honorable mentions are [Funkhaus](https://funkhaus.us/) for their work on the WPGraphQL Cors plugin. And the people who have contributed to making WooNuxt better every day. [Zack Hatlen](https://github.com/zackha), [Galli](https://github.com/Zielgestalt), [Guillaume](https://github.com/GuillaumeDgr), Thank you all! 🙏

I don't know where this project will go but I'm excited to see what the future holds. If you have any questions or would like to contribute to the project please feel free to reach out to me on [Twitter](https://twitter.com/scottyzen) or [GitHub](https://github.com/scottyzen).

&nbsp;

> **Note** If you're looking for the old version of WooNuxt you can find it on the [v2 branch](https://github.com/scottyzen/woonuxt/tree/v2).

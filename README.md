![full](https://user-images.githubusercontent.com/5116925/218879668-f4c1f9fd-bef4-44b0-bc7f-e87d994aa3a1.png)

# Next Generation Front-End for WooCommerce

> **Note** This is the first iteration of the new WooNuxt built on Nuxt 3. It's under active development and has a lot of features still to be added. You can use the old version of WooNuxt on the [v2 branch](https://github.com/scottyzen/woonuxt/tree/v2) which is more stable.

&nbsp;

## Introduction

The goal of WooNuxt is to provide a modern, fast, and SEO friendly front-end for WooCommerce. It's built on top of Nuxt 3 and uses the WPGraphQL API to retrieve all the data it needs. It's also fully customizable and can be extended with your own components and modules. You can see a live demo of WooNuxt by clicking the button below.

👉 [**Live Demo of WooNuxt**](https://v3.woonuxt.com/) ⚡️

&nbsp;

## Get Started

- Download the [WooNuxt Settings](https://github.com/scottyzen/woonuxt-settings/releases/download/1.0.34/woonuxt-settings.zip) plugin.
- Install and activate the plugin on your WordPress site. This will install all the required plugins for WooNuxt, add some useful fields to the WPGraphQL schema, and automatically retrieve the WooCommerce payment gateway settings for Stripe and PayPal.
- Once the plugin is activated your ready to deploy WooNuxt on a whatever hosting you like, or click one onf the fast deploy button below.
- Once the plugin is activated the only required environment variable is `GQL_HOST`. Checkout the .env.example file for more details.

[![button](https://user-images.githubusercontent.com/5116925/218880214-a16287a7-fd8c-4299-9e65-0871136f0771.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/scottyzen/woonuxt)

&nbsp;

### Progress

| Feature                                               | Ongoing Enhancements | Done | In Progress | In the Pipeline |
| ----------------------------------------------------- | -------------------- | ---- | ----------- | --------------- |
| Proformanance                                         | ✅                   | ✅   |             |                 |
| SEO                                                   |                      |      | ✅          |                 |
| Cart                                                  |                      | ✅   |             |                 |
| Search                                                |                      | ✅   |             |                 |
| Shipping                                              |                      | ✅   |             |                 |
| Checkout (Stripe, PayPay, Cash on Delivery)           |                      | ✅   |             |                 |
| Filtering                                             | ✅                   | ✅   |             |                 |
| Wishlists                                             |                      | ✅   |             |                 |
| Account                                               |                      |      | ✅          |                 |
| Coupons                                               |                      | ✅   |             |                 |
| Product Reviews                                       |                      |      | ✅          |                 |
| Product Category Pages                                |                      |      | ✅          |                 |
| WooNuxt Settings Module                               |                      |      | ✅          |                 |
| Better Typescript Supp                                |                      |      | ✅          |                 |
| Mobile layout                                         | ✅                   |      | ✅          |                 |
| Countries & States Enums                              |                      |      | ✅          |                 |
| Cookie Popup & GDPR Compliance                        |                      |      |             | ✅              |
| Progressive Web App (PWA)                             |                      |      | ✅          |                 |
| Queing System (for chcecking out when server is busy) |                      |      |             | ✅              |
| Language Support (i18n)                               |                      |      | ✅          |                 |

&nbsp;

### Required WordPress Plugins

| Plugin Name    | Description                              | Link                                        |
| -------------- | ---------------------------------------- | ------------------------------------------- |
| WPGraphQL      | A free, open-source plugin for WordPress | https://www.wpgraphql.com/                  |
| WooGraphQL     | GraphQL API for WooCommerce              | https://woographql.com/                     |
| WPGraphQL Cors | Enable CORS for WPGraphQL                | https://github.com/funkhaus/wp-graphql-cors |

> **Note** The the [WooNuxt Settings](https://github.com/scottyzen/woonuxt-settings/releases/download/1.0.29/woonuxt-settings.zip) plugin will help you install all the required plugins. WooGraphQL 0.13.0 and up is required to get the list of available countries and states. You can find the latest version of WooGraphQL [here](https://github.com/wp-graphql/wp-graphql-woocommerce/releases)

&nbsp;

### Required Environment Variables

`GQL_HOST` - The URL of your WordPress site. This is the only required environment variable.

&nbsp;

#### Tested up to:

| Plugin/Software | Version |
| --------------- | ------- |
| WordPress       | 6.2.2   |
| WooCommerce     | 7.7.2   |
| WPGraphQL       | 1.14.0  |
| WooGraphQL      | 0.13.0  |
| Node            | 16.18.1 |

### Current translations

- English 🇺🇸
- Deutsch 🇩🇪
- Español 🇪🇸

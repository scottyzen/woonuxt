import { createResolver, defineNuxtModule, logger } from '@nuxt/kit';
import { existsSync, writeFileSync } from 'fs';
import { $fetch } from 'ohmyfetch';

const query = `
query getWooNuxtSettings {
  woonuxtSettings {
    primary_color
    logo
    publicIntrospectionEnabled
    frontEndUrl
    maxPrice
    productsPerPage
    global_attributes {
      slug
      showCount
      openByDefault
      label
      hideEmpty
    }
    stripeSettings {
      enabled
      testmode
      test_publishable_key
      publishable_key
    }
  }
}
`;

const allProductsQuery = `
query getProducts($after: String, $slug: [String], $first: Int = 10, $orderby: [ProductsOrderbyInput] = {field: DATE, order: DESC}) {
  products(
    first: $first
    after: $after
    where: {categoryIn: $slug, typeNotIn: EXTERNAL, visibility: VISIBLE, minPrice: 0, orderby: $orderby, status: "publish"}
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      name
      onSale
      slug
      type
      databaseId
      id
      averageRating
      reviewCount
      ...on VariableProduct {
        price
        rawPrice: price(format: RAW)
        slug
        date
        weight
        length
        width
        height
        image {
          sourceUrl
          cartSourceUrl: sourceUrl(size: THUMBNAIL)
          producCardSourceUrl: sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
          altText
          title
          databaseId
        }
        averageRating
        reviewCount
        regularPrice
        rawRegularPrice: regularPrice(format: RAW)
        salePrice
        rawSalePrice: salePrice(format: RAW)
        stockStatus
        totalSales
        stockQuantity
        lowStockAmount
        terms(first: 20) {
          nodes {
            taxonomyName
            slug
          }
        }
        productCategories {
          nodes {
            databaseId
            slug
            name
            count
          }
        }
        defaultAttributes {
          nodes {
            name
            attributeId
            value
            label
          }
        }
        variations(first: 20) {
          nodes {
            name
            databaseId
            price
            regularPrice
            salePrice
            slug
            stockQuantity
            stockStatus
            hasAttributes
            image {
              sourceUrl
              cartSourceUrl: sourceUrl(size: THUMBNAIL)
              producCardSourceUrl: sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
              databaseId
              altText
              title
              id
            }
            attributes {
              nodes {
                value
                name
              }
            }
          }
        }
        galleryImages {
          nodes {
            sourceUrl
            databaseId
            altText
            title
          }
        }
      }
      ...on SimpleProduct {
        price
        rawPrice: price(format: RAW)
        slug
        date
        regularPrice
        rawRegularPrice: regularPrice(format: RAW)
        salePrice
        rawSalePrice: salePrice(format: RAW)
        stockStatus
        stockQuantity
        lowStockAmount
        averageRating
        weight
        length
        width
        height
        reviewCount
        image {
          sourceUrl
          cartSourceUrl: sourceUrl(size: THUMBNAIL)
          producCardSourceUrl: sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
          databaseId
          altText
          title
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
            title
          }
        }
        terms(first: 20) {
          nodes {
            taxonomyName
            slug
          }
        }
        productCategories {
          nodes {
            databaseId
            slug
            name
            count
          }
        }
      }
    }
  }
}
`;

// Module options TypeScript inteface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: { name: 'woonuxt', configKey: 'woonuxt' },
  defaults: {},
  async setup(_, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const GQL_HOST = process.env.GQL_HOST ?? null;

    if (!GQL_HOST) {
      console.log('\u001B[1;35mGQL_HOST is missing. Make sure you have the GQL_HOST environment variable set.');
      return;
    }

    try {
      const { data } = await $fetch(GQL_HOST, {
        method: 'POST',
        body: JSON.stringify({ query }),
      });

      if (data.woonuxtSettings?.publicIntrospectionEnabled !== 'on') {
        // @ts-ignore
        nuxt.options.graphql = {
          codegen: false,
        };
      }

      // Default env variables
      process.env.PRIMARY_COLOR = data.woonuxtSettings?.primary_color || '#7F54B2';
      process.env.PUBLIC_INTROSPECTION_ENABLED = data.woonuxtSettings?.publicIntrospectionEnabled === 'on' ? 'on' : 'false';

      // Default runtimeConfig
      nuxt.options.runtimeConfig.public.LOGO = data.woonuxtSettings?.logo || null;
      nuxt.options.runtimeConfig.public.PRODUCTS_PER_PAGE = data.woonuxtSettings?.productsPerPage || process.env.PRODUCTS_PER_PAGE || 24;
      nuxt.options.runtimeConfig.public.GLOBAL_PRODUCT_ATTRIBUTES = data.woonuxtSettings?.global_attributes || [];
      nuxt.options.runtimeConfig.public.MAX_PRICE = data.woonuxtSettings?.maxPrice || 1000;
      nuxt.options.runtimeConfig.public.FRONT_END_URL = data.woonuxtSettings?.frontEndUrl || null;

      // Stripe
      if (data.woonuxtSettings?.stripeSettings?.enabled === 'yes') {
        nuxt.options.runtimeConfig.public.STRIPE_PUBLISHABLE_KEY =
          data.woonuxtSettings?.stripeSettings?.testmode === 'yes'
            ? data.woonuxtSettings?.stripeSettings?.test_publishable_key
            : data.woonuxtSettings?.stripeSettings?.publishable_key;
      }
    } catch (error) {
      console.log(
        '\u001B[1;35mError fetching woonuxt settings. Make sure you have the latest version woonuxt-settings plugin installed and activated on your WordPress site. You can download it from https://github.com/scottyzen/woonuxt-settings',
      );
    }

    let temperaryProductsArray = [] as any[];
    const FILE_NAME = 'all_products.json';
    const src = resolve(__dirname, `../public/${FILE_NAME}`);

    // Fetch all products
    const fetchAllProducts = async (after = ''): Promise<any[]> => {
      try {
        const { data } = await $fetch(GQL_HOST, {
          method: 'POST',
          body: JSON.stringify({
            query: allProductsQuery,
            variables: { after, first: 20 },
          }),
        });

        const { products } = data;
        temperaryProductsArray = [...temperaryProductsArray, ...products.nodes];

        if (products.pageInfo.hasNextPage) {
          logger.info('Fetching more products...');
          return fetchAllProducts(products.pageInfo.endCursor);
        }

        logger.success('All products fetched.');
        return temperaryProductsArray;
      } catch (error) {
        logger.error('Error fetching products:', error);
        return [];
      }
    };

    const allProducts = await fetchAllProducts();

    nuxt.hook('build:before', async () => {
      try {
        // if (existsSync(src)) {
        //   logger.info('All products file already exists.');
        //   return;
        // }

        writeFileSync(
          src,
          JSON.stringify({
            data: {
              products: {
                nodes: allProducts,
              },
            },
          }),
        );
        logger.success('All products file created.');
      } catch (error) {
        logger.error('Error copying file:', error);
      }
    });
  },
});

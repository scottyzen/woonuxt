<script lang="ts" setup>
import { StockStatusEnum } from '~/.nuxt/gql/default';
import type { AddToCartInput } from '#gql';
const route = useRoute();
const { arraysEqual, formatArray, checkForVariationTypeOfAny } = useHelpers();
const { addToCart, isUpdatingCart } = useCart();
const slug = route.params.slug as string;

const { data } = (await useAsyncGql('getProduct', { slug })) as { data: { value: { product: Product } } };
const product = ref<Product>(data?.value?.product);

const quantity = ref(1);
const activeVariation = ref(null) as Ref<Variation | null>;
const variation = ref([]) as Ref<Variation[]>;
const indexOfTypeAny = [] as number[];
const attrValues = ref();
const isSimpleProduct = computed(() => product.value.type === 'SIMPLE');
const isVariableProduct = computed(() => product.value.type === 'VARIABLE');

const type = computed(() => (activeVariation.value ? activeVariation.value : product.value));
const selectProductInput = computed(() => ({ productId: type.value.databaseId, quantity: quantity.value })) as ComputedRef<AddToCartInput>;
const mergeLiveStockStatus = (payload: Product): void => {
  product.value.stockStatus = payload.stockStatus ?? product.value.stockStatus;

  payload.variations?.nodes.forEach((variation: Variation, index: number) => {
    if (product.value.variations?.nodes[index]) {
      // @ts-ignore
      product.value.variations.nodes[index].stockStatus = variation.stockStatus;
    }
  });
};

onMounted(async () => {
  try {
    const { product } = (await GqlGetStockStatus({ slug })) as { product: Product };
    mergeLiveStockStatus(product);
  } catch (error: any) {
    const errorMessage = error?.gqlErrors?.[0].message;
    if (errorMessage) console.error(errorMessage);
  }
  if (product.value.variations) indexOfTypeAny.push(...checkForVariationTypeOfAny(product.value));
});

const updateSelectedVariations = (variations: Attribute[]): void => {
  if (!product.value.variations) return;

  attrValues.value = variations.map((el) => ({ attributeName: el.name, attributeValue: el.value }));
  const cloneArray = JSON.parse(JSON.stringify(variations));
  const getActiveVariation = product.value.variations.nodes.filter((variation: any) => {
    // If there is any variation of type ANY set the value to ''
    if (variation.attributes) {
      indexOfTypeAny.forEach((index) => (cloneArray[index].value = ''));
      return arraysEqual(formatArray(variation.attributes.nodes), formatArray(cloneArray));
    }
  });

  activeVariation.value = getActiveVariation[0];
  selectProductInput.value.variationId = activeVariation.value?.databaseId ?? null;
  selectProductInput.value.variation = activeVariation.value ? attrValues.value : null;
  variation.value = variations;
};

const stockStatus = computed(() => {
  if (isVariableProduct.value) return activeVariation.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
  return type.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
});
const disabledAddToCart = computed(() => {
  if (isSimpleProduct.value) return !type.value || stockStatus.value === StockStatusEnum.OUT_OF_STOCK || isUpdatingCart.value;
  return !type.value || stockStatus.value === StockStatusEnum.OUT_OF_STOCK || !activeVariation.value || isUpdatingCart.value;
});
</script>

<template>
  <main class="container relative py-6 xl:max-w-7xl" v-if="product">
    <SEOHead :info="product" />
    <Breadcrumb :product class="mb-6" />

    <div class="flex flex-col gap-10 md:flex-row md:justify-between lg:gap-24">
      <ProductImageGallery
        v-if="product.image"
        class="relative flex-1"
        :main-image="product.image"
        :gallery="product.galleryImages!"
        :node="type"
        :activeVariation="activeVariation || {}" />
      <NuxtImg v-else class="relative flex-1 skeleton" src="/images/placeholder.jpg" :alt="product?.name || 'Product'" />

      <div class="lg:max-w-md xl:max-w-lg md:py-2 w-full">
        <div class="flex justify-between mb-4">
          <div class="flex-1">
            <h1 class="flex flex-wrap items-center gap-2 mb-2 text-2xl font-sesmibold">
              {{ type.name }}
              <WPAdminLink :link="`/wp-admin/post.php?post=${product.databaseId}&action=edit`">Edit</WPAdminLink>
            </h1>
            <StarRating :rating="product.averageRating || 0" :count="product.reviewCount || 0" />
          </div>
          <ProductPrice class="text-xl" :sale-price="type.salePrice" :regular-price="type.regularPrice" />
        </div>

        <div class="grid gap-2 my-8 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-gray-400">{{ $t('messages.shop.availability') }}: </span>
            <StockStatus :stockStatus @updated="mergeLiveStockStatus" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-400">{{ $t('messages.shop.sku') }}: </span>
            <span>{{ product.sku || 'N/A' }}</span>
          </div>
        </div>

        <div class="mb-8 font-light prose" v-html="product.shortDescription || product.description" />

        <hr />

        <form @submit.prevent="addToCart(selectProductInput)">
          <AttributeSelections
            v-if="product.type == 'VARIABLE' && product.attributes && product.variations"
            class="mt-4 mb-8"
            :attributes="product.attributes.nodes"
            :defaultAttributes="product.defaultAttributes"
            :variations="product.variations.nodes"
            @attrs-changed="updateSelectedVariations" />
          <div class="fixed bottom-0 left-0 z-10 flex items-center w-full gap-4 p-4 mt-12 bg-white md:static md:bg-transparent bg-opacity-90 md:p-0">
            <input
              v-model="quantity"
              type="number"
              min="1"
              aria-label="Quantity"
              class="bg-white border rounded-lg flex text-left p-2.5 w-20 gap-4 items-center justify-center focus:outline-none" />
            <AddToCartButton class="flex-1 w-full md:max-w-xs" :disabled="disabledAddToCart" :class="{ loading: isUpdatingCart }" />
          </div>
        </form>

        <div class="grid gap-2 my-8 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-gray-400">{{ $t('messages.shop.category', 2) }}:</span>
            <div class="product-categories" v-if="product.productCategories">
              <NuxtLink
                v-for="category in product.productCategories.nodes"
                :key="category.slug"
                :to="`/product-category/${decodeURIComponent(category.slug)}`"
                class="hover:text-primary"
                :title="category.name"
                >{{ category.name }}<span class="comma">, </span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <hr />

        <div class="flex flex-wrap gap-4">
          <WishlistButton :product />
          <ShareButton :product />
        </div>
      </div>
    </div>
    <div v-if="product.description || product.reviews" class="my-32">
      <ProductTabs :product />
    </div>
    <div class="my-32" v-if="product.related">
      <div class="mb-4 text-xl font-semibold">{{ $t('messages.shop.youMayLike') }}</div>
      <ProductRow :products="product.related.nodes" class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5" />
    </div>
  </main>
</template>

<style scoped>
.product-categories > a:last-child .comma {
  display: none;
}

input[type='number']::-webkit-inner-spin-button {
  opacity: 1;
}
</style>

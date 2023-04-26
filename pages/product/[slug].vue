<script lang="ts" setup>
const route = useRoute();
const { arraysEqual, formatArray } = useHelpers();
const { addToCart, isUpdatingCart } = useCart();

const { data } = await useAsyncGql('getProduct', { slug: route.params.slug as string });
const product = data?.value?.product as Product;

useHead({
  title: product?.name || 'Product',
  meta: [{ hid: 'description', name: 'description', content: product?.description || '' }],
});

const quantity = ref(1);
const activeVariation = ref(null) as Ref<Variation | null>;
const variation = ref([]) as Ref<Variation[]>;
const indexOfTypeAny = [] as number[];
const attrValues = ref();

const type = computed(() => (activeVariation.value ? activeVariation.value : product)) as ComputedRef<Product | Variation>;
const primaryCategory = computed(() => {
  return product.productCategories?.nodes[0];
});
const selectProductInput = computed(() => ({
  productId: type.value.databaseId,
  quantity: quantity.value,
})) as ComputedRef<AddToCartInput>;

const checkForVariationTypeOfAny = () => {
  const numberOfVariation = product?.attributes?.nodes?.length || 0;
  for (let index = 0; index < numberOfVariation; index++) {
    const tempArray = [] as string[];
    product.variations?.nodes.forEach((element) => {
      if (element.attributes?.nodes[index]?.value) tempArray.push(element.attributes.nodes[index].value as string);
    });

    if (!tempArray.some(Boolean)) indexOfTypeAny.push(index);
  }
};

onMounted(() => {
  if (product.variations) checkForVariationTypeOfAny();
});

const updateSelectedVariations = (variations: Variation[]) => {
  if (!product.variations) return;

  attrValues.value = variations.map((el: Attribute) => ({
    attributeName: el.name,
    attributeValue: el.value,
  }));
  const cloneArray = JSON.parse(JSON.stringify(variations));
  const getActiveVariation = product.variations.nodes.filter((variation) => {
    // If there is any variation of type ANY set the value to ''
    if (variation.attributes) {
      indexOfTypeAny.forEach((index) => (cloneArray[index].value = ''));
      return arraysEqual(formatArray(variation.attributes.nodes), formatArray(cloneArray));
    }
  });

  activeVariation.value = getActiveVariation[0];
  selectProductInput.value.variationId = activeVariation.value?.databaseId || null;
  selectProductInput.value.variation = activeVariation.value ? attrValues.value : null;
  variation.value = variations;
};
</script>

<template>
  <main class="container relative py-6 xl:max-w-7xl" v-if="product">
    <!-- Breadcrumb -->
    <Breadcrumb
      v-if="primaryCategory"
      class="mb-6"
      :format="[
        { name: 'Products', slug: '/products' },
        {
          name: primaryCategory.name,
          slug: `/product-category/${primaryCategory.slug}`,
        },
        { name: product.name },
      ]" />

    <div class="flex flex-col gap-10 md:flex-row md:justify-between lg:gap-24">
      <ProductImageGallery
        v-if="product.image"
        class="relative flex-1"
        :first-image="product.image.sourceUrl!"
        :main-image="type.image ? type.image.sourceUrl! : product.image.sourceUrl!"
        :gallery="product.galleryImages!"
        :node="type" />
      <NuxtImg v-else class="relative flex-1" src="/images/placeholder.jpg" :alt="product.name!" />

      <div class="md:max-w-md md:py-2">
        <div class="flex justify-between mb-4">
          <div class="flex-1">
            <h1 class="mb-2 text-2xl font-sesmibold">{{ type.name }}</h1>
            <StarRating :rating="product.averageRating || 0" :count="product.reviewCount || 0" />
          </div>
          <ProductPrice class="text-xl" :sale-price="type.salePrice" :regular-price="type.regularPrice" />
        </div>

        <div class="grid gap-2 my-8 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-gray-400">{{ $t('messages.shop.availability') }}: </span>
            <span v-if="type.stockStatus == 'IN_STOCK'" class="text-green-600">{{ $t('messages.shop.inStock') }}</span>
            <span v-else class="text-red-600">{{ $t('messages.shop.outOfStock') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-400">{{ $t('messages.shop.sku') }}: </span>
            <span>{{ product.sku || 'N/A' }}</span>
          </div>
        </div>

        <div class="mb-8 font-light prose" v-html="product.description || product.shortDescription"></div>

        <hr />

        <form @submit.prevent="addToCart(selectProductInput)">
          <AttributeSelections
            v-if="product.type == 'VARIABLE' && product.attributes && product.variations"
            class="mt-4 mb-8"
            :attrs="product.attributes.nodes"
            :variations="product.variations.nodes"
            @attrs-changed="updateSelectedVariations" />
          <div class="flex items-center gap-4 mt-12">
            <input
              v-model="quantity"
              type="number"
              min="1"
              aria-label="Quantity"
              class="bg-white border rounded-lg flex text-left p-2.5 w-20 gap-4 items-center justify-center focus:outline-none" />
            <AddToCartButton class="flex-1 w-full md:max-w-xs" :disabled="!activeVariation && !!product.variations" :class="{ loading: isUpdatingCart }" />
          </div>
        </form>

        <div class="grid gap-2 my-8 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-gray-400">{{ $t('messages.shop.category', 2) }}:</span>
            <div class="product-categories" v-if="product.productCategories">
              <NuxtLink v-for="category in product.productCategories.nodes" :key="category.slug" :to="`/product-category/${category.slug}`" class="hover:text-primary"
                >{{ category.name }}<span class="comma">, </span></NuxtLink
              >
            </div>
          </div>
        </div>
        <hr />
        <div class="flex flex-wrap gap-4">
          <WishlistButton :product="product" />
          <ShareButton :product="product" />
        </div>
      </div>
    </div>
    <div class="my-32">
      <ProductTabs :product="product" />
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

<script lang="ts" setup>
import { StockStatusEnum, ProductTypesEnum, type AddToCartInput } from '#gql/default';
import type { ExternalProduct, ProductDetail, SimpleProduct, VariableProduct, Variation, VariationAttribute } from '#types/gql';

const route = useRoute();
const router = useRouter();
const { storeSettings } = useAppConfig();
const { addToCart, isUpdatingCart } = useCart();
const { t } = useI18n();
const slug = route.params.slug as string;

const { data } = await useAsyncGql('getProduct', { slug });
if (!data.value?.product) {
  throw showError({ statusCode: 404, statusMessage: t('shop.productNotFound') });
}

const product = ref<ProductDetail>(data?.value?.product);
const quantity = ref<number>(1);
const activeVariation = ref<Variation | null>(null);
const variation = ref<VariationAttribute[]>([]);
const attrValues = ref();

const normalizeMatchToken = (value?: string | null): string =>
  (value ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s-_]+/g, '');

const stripPaPrefix = (value?: string | null): string => (value ?? '').toString().replace(/^pa[_-]/i, '');

const normalizeMatchKey = (value?: string | null): string => normalizeMatchToken(stripPaPrefix(value));
const normalizeMatchValue = (value?: string | null): string => normalizeMatchToken(value);

const toSelectionName = (name?: string | null): string => {
  if (!name) return '';
  return name.charAt(0).toLowerCase() + name.slice(1);
};

const normalizedVariations = computed(() => {
  const nodes = product.value?.variations?.nodes ?? [];
  return nodes.map((node: Variation) => {
    const attrs: Record<string, string> = {};
    node.attributes?.nodes?.forEach((attr) => {
      const key = normalizeMatchKey(attr.name);
      if (!key) return;
      attrs[key] = normalizeMatchValue(attr.value);
    });

    const specificity = Object.values(attrs).filter(Boolean).length;
    return { variation: node, attrs, specificity };
  });
});

const findMatchingVariation = (selected: VariationAttribute[]): Variation | null => {
  if (!selected?.length) return null;

  const selectedMap: Record<string, string> = {};
  selected.forEach((attr) => {
    const key = normalizeMatchKey(attr.name);
    if (!key) return;
    const value = normalizeMatchValue(attr.value);
    if (!value) return;
    selectedMap[key] = value;
  });

  if (Object.keys(selectedMap).length === 0) return null;

  let bestMatch: { variation: Variation; score: number } | null = null;

  for (const candidate of normalizedVariations.value) {
    let matches = true;
    let matchedSpecific = 0;

    for (const [key, value] of Object.entries(selectedMap)) {
      const candidateValue = candidate.attrs[key];
      if (!candidateValue) continue;
      if (candidateValue !== value) {
        matches = false;
        break;
      }
      matchedSpecific += 1;
    }

    if (!matches) continue;

    const score = matchedSpecific * 100 + candidate.specificity;
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { variation: candidate.variation, score };
    }
  }

  return bestMatch?.variation ?? null;
};

// Pre-select variation based on URL query params BEFORE component mounts
const queryParams = route.query;

const findVariationById = (value?: string | number | null): Variation | null => {
  if (!value || !product.value?.variations?.nodes?.length) return null;
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : value;
  if (!parsed || Number.isNaN(parsed)) return null;
  return product.value?.variations?.nodes?.find((node: Variation) => node.databaseId === parsed) ?? null;
};

const buildQuerySelections = (): VariationAttribute[] => {
  if (!product.value?.attributes?.nodes?.length) return [];

  const selections: VariationAttribute[] = [];
  for (const attr of product.value.attributes.nodes) {
    const key = toSelectionName(attr?.name);
    if (!key) continue;

    const rawQueryValue = queryParams[key];
    if (!rawQueryValue) continue;

    const value = Array.isArray(rawQueryValue) ? rawQueryValue[0] : rawQueryValue;
    const normalizedValue = normalizeMatchValue(value);
    if (!normalizedValue) continue;

    const isValidValue =
      attr.scope === 'LOCAL'
        ? (attr.options ?? []).some((option: string | null) => normalizeMatchValue(option ?? '') === normalizedValue)
        : 'terms' in attr && (attr.terms?.nodes ?? []).some((term) => normalizeMatchValue(term?.slug ?? '') === normalizedValue);

    if (!isValidValue) continue;

    selections.push({ name: key, value: String(value) });
  }

  return selections;
};

const queryVariationId = queryParams.variationId ?? queryParams.variation;
const variationFromQuery = findVariationById(Array.isArray(queryVariationId) ? queryVariationId[0] : queryVariationId);

if (variationFromQuery?.attributes?.nodes?.length) {
  variation.value = variationFromQuery.attributes.nodes.map((attr: VariationAttribute) => ({
    name: attr.name || '',
    value: attr.value || '',
  }));
  activeVariation.value = variationFromQuery;
} else {
  const initialSelections = buildQuerySelections();
  if (initialSelections.length > 0) {
    const matched = findMatchingVariation(initialSelections);
    if (matched?.attributes?.nodes?.length) {
      variation.value = matched.attributes.nodes.map((attr: VariationAttribute) => ({
        name: attr.name || '',
        value: attr.value || '',
      }));
      activeVariation.value = matched;
    } else {
      variation.value = initialSelections;
    }
  }
}

const defaultAttributes = computed<{ nodes: VariationAttribute[] } | null>(() => {
  if (variation.value.length > 0) {
    return { nodes: variation.value };
  }
  return product.value?.defaultAttributes ? { nodes: product.value.defaultAttributes.nodes ?? [] } : null;
});

const isSimpleProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.SIMPLE);
const isVariableProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.VARIABLE);
const isExternalProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.EXTERNAL);
const externalProduct = computed<ExternalProduct | null>(() => (isExternalProduct.value ? (product.value as ExternalProduct) : null));
const shouldSkipStockRefresh = computed<boolean>(() => isExternalProduct.value);

const displayProduct = computed(() => activeVariation.value || product.value);
const priceTarget = computed(() => activeVariation.value || product.value);
const productImage = computed(() => product.value?.image || null);
const productGallery = computed(() => ({ nodes: product.value?.galleryImages?.nodes ?? [] }));
const averageRating = computed(() => product.value?.averageRating ?? 0);
const reviewCount = computed(() => product.value?.reviewCount ?? 0);

const selectProductInput = computed<any>(() => ({ productId: displayProduct.value?.databaseId, quantity: quantity.value })) as ComputedRef<AddToCartInput>;

const updateSelectedVariations = (variations: VariationAttribute[]): void => {
  if (!product.value?.variations) return;

  attrValues.value = variations.map((el) => ({ attributeName: el.name, attributeValue: el.value }));
  activeVariation.value = findMatchingVariation(variations);

  selectProductInput.value.variationId = activeVariation.value?.databaseId ?? null;
  selectProductInput.value.variation = activeVariation.value ? attrValues.value : null;
  variation.value = variations;

  // Update URL with current selections for persistence and sharing (client-side only)
  if (import.meta.client) {
    const query: Record<string, string> = {};
    variations.forEach((v) => {
      if (v.name && v.value) {
        query[v.name] = v.value;
      }
    });
    if (activeVariation.value?.databaseId) {
      query.variationId = String(activeVariation.value.databaseId);
    }

    // Build new URL with query params
    const url = new URL(window.location.href);
    url.search = new URLSearchParams(query).toString();

    // Use replaceState to update URL without triggering navigation/scroll
    window.history.replaceState({ ...window.history.state }, '', url.toString());
  }
};

const mergeLiveStockStatus = (payload: ProductDetail): void => {
  product.value.stockStatus = payload.stockStatus ?? product.value.stockStatus;

  payload.variations?.nodes?.forEach((variation: Variation, index: number) => {
    if (product.value?.variations?.nodes?.[index]) {
      product.value.variations.nodes[index].stockStatus = variation.stockStatus;
    }
  });
};

const refreshStockStatus = async (): Promise<void> => {
  try {
    const { product } = await GqlGetStockStatus({ slug });
    if (product) mergeLiveStockStatus(product as ProductDetail);
  } catch (error: any) {
    const errorMessage = error?.gqlErrors?.[0]?.message;
    if (errorMessage) console.error(errorMessage);
  }
};

type IdleCallback = (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void;
type IdleCallbackWindow = Window & {
  requestIdleCallback?: (callback: IdleCallback, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

let stockRefreshHandle: number | null = null;
let stockRefreshHandleType: 'idle' | 'timeout' | null = null;

const scheduleStockRefresh = (): void => {
  if (!import.meta.client || shouldSkipStockRefresh.value) return;

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return;

  if (stockRefreshHandle !== null) return;

  const run = () => {
    stockRefreshHandle = null;
    stockRefreshHandleType = null;
    void refreshStockStatus();
  };

  const idleWindow = window as IdleCallbackWindow;
  if (idleWindow.requestIdleCallback) {
    stockRefreshHandleType = 'idle';
    stockRefreshHandle = idleWindow.requestIdleCallback(() => run(), { timeout: 2000 });
  } else {
    stockRefreshHandleType = 'timeout';
    stockRefreshHandle = window.setTimeout(run, 900);
  }
};

onMounted(scheduleStockRefresh);
onBeforeUnmount(() => {
  if (!import.meta.client || stockRefreshHandle === null) return;
  const idleWindow = window as IdleCallbackWindow;
  if (stockRefreshHandleType === 'idle' && idleWindow.cancelIdleCallback) {
    idleWindow.cancelIdleCallback(stockRefreshHandle);
  } else {
    clearTimeout(stockRefreshHandle);
  }
  stockRefreshHandle = null;
  stockRefreshHandleType = null;
});

const stockStatus = computed(() => {
  if (isVariableProduct.value) {
    return activeVariation.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
  }
  return (product.value as SimpleProduct | VariableProduct)?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
});

const disabledAddToCart = computed(() => {
  const isOutOfStock = stockStatus.value === StockStatusEnum.OUT_OF_STOCK;
  const isInvalidType = !displayProduct.value;
  const isCartUpdating = isUpdatingCart.value;
  const isValidActiveVariation = isVariableProduct.value ? !!activeVariation.value : true;
  return isInvalidType || isOutOfStock || isCartUpdating || !isValidActiveVariation;
});
</script>

<template>
  <main class="container relative py-6 xl:max-w-7xl">
    <div v-if="product">
      <SEOHead :info="product" />
      <Breadcrumb :product class="mb-6" v-if="storeSettings.showBreadcrumbOnSingleProduct" />

      <div class="flex flex-col gap-10 md:flex-row md:justify-between lg:gap-24">
        <ProductImageGallery
          v-if="productImage"
          class="relative flex-1"
          :main-image="productImage"
          :gallery="productGallery"
          :node="displayProduct"
          :activeVariation="activeVariation || {}" />
        <NuxtImg v-else class="relative flex-1 skeleton" src="/images/placeholder.jpg" :alt="product?.name || 'Product'" />

        <div class="w-full lg:max-w-md xl:max-w-lg md:py-2">
          <div class="flex justify-between mb-4">
            <div class="flex-1">
              <h1 class="flex flex-wrap items-center gap-2 mb-2 text-2xl font-sesmibold dark:text-white">
                {{ displayProduct.name }}
                <LazyWPAdminLink :link="`/wp-admin/post.php?post=${product.databaseId}&action=edit`">Edit</LazyWPAdminLink>
              </h1>
              <StarRating :rating="averageRating" :count="reviewCount" v-if="storeSettings.showReviews" />
            </div>
            <ProductPrice class="text-xl" :sale-price="priceTarget?.salePrice" :regular-price="priceTarget?.regularPrice" />
          </div>

          <div class="grid gap-2 my-8 text-sm empty:hidden">
            <div v-if="!isExternalProduct" class="flex items-center gap-2">
              <span class="text-gray-400 dark:text-gray-500">{{ $t('shop.availability') }}: </span>
              <StockStatus :stockStatus @updated="mergeLiveStockStatus" />
            </div>
            <div class="flex items-center gap-2" v-if="storeSettings.showSKU && product?.sku">
              <span class="text-gray-400 dark:text-gray-500">{{ $t('shop.sku') }}: </span>
              <span class="dark:text-gray-300">{{ product?.sku || 'N/A' }}</span>
            </div>
          </div>

          <div class="mb-8 font-light prose dark:prose-invert" v-html="product.shortDescription || product.description" />

          <hr class="border-gray-300 dark:border-gray-600" />

          <form @submit.prevent="addToCart(selectProductInput)">
            <AttributeSelections
              v-if="isVariableProduct && product?.attributes?.nodes?.length && product?.variations"
              class="mt-4 mb-8"
              :attributes="product.attributes.nodes"
              :defaultAttributes="defaultAttributes"
              :variations="product.variations.nodes"
              @attrs-changed="updateSelectedVariations" />
            <div
              v-if="isVariableProduct || isSimpleProduct"
              class="fixed bottom-0 left-0 z-10 flex items-center w-full gap-4 p-4 mt-12 shadow-lg bg-white/90 md:static md:bg-transparent md:p-0 md:shadow-none dark:shadow-gray-900">
              <input
                v-model="quantity"
                type="number"
                min="1"
                aria-label="Quantity"
                class="flex items-center justify-center w-20 gap-4 p-2 text-left bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-hidden dark:text-white" />
              <Button class="flex-1 w-full md:max-w-xs" :disabled="disabledAddToCart" :loading="isUpdatingCart" type="submit">
                {{ $t('shop.addToCart') }}
              </Button>
            </div>
            <a
              v-if="externalProduct?.externalUrl"
              :href="externalProduct.externalUrl"
              target="_blank"
              class="rounded-lg flex font-bold bg-gray-800 dark:bg-gray-700 text-white text-center min-w-37.5 p-2.5 gap-4 items-center justify-center focus:outline-hidden hover:bg-gray-700 dark:hover:bg-gray-600">
              {{ externalProduct?.buttonText || 'View product' }}
            </a>
          </form>

          <div v-if="storeSettings.showProductCategoriesOnSingleProduct && product.productCategories">
            <div class="grid gap-2 my-8 text-sm">
              <div class="flex items-center gap-2">
                <span class="text-gray-400 dark:text-gray-500">{{ $t('shop.category', 2) }}:</span>
                <div class="product-categories">
                  <NuxtLink
                    v-for="category in product.productCategories.nodes"
                    :key="category.databaseId"
                    :to="`/product-category/${decodeURIComponent(category?.slug || '')}`"
                    class="hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                    :title="category.name || ''"
                    >{{ category.name }}<span class="comma">, </span>
                  </NuxtLink>
                </div>
              </div>
            </div>
            <hr class="border-gray-300 dark:border-gray-600" />
          </div>

          <div class="flex flex-wrap gap-4">
            <WishlistButton :product />
            <ShareButton :product />
          </div>
        </div>
      </div>
      <div v-if="product.description || product.reviews" class="my-32">
        <ProductTabs :product />
      </div>
      <div class="my-32" v-if="product.related && storeSettings.showRelatedProducts">
        <div class="mb-4 text-xl font-semibold dark:text-white">{{ $t('shop.youMayLike') }}</div>
        <LazyProductRow :products="product.related.nodes" class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.product-categories > a:last-child .comma {
  display: none;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  opacity: 1;
}

/* Dark mode uses color-scheme to style native controls */
.dark input[type='number'] {
  color-scheme: dark;
}
</style>

<script setup lang="ts">
const { product } = defineProps({
  product: { type: Object as PropType<Product>, required: true },
});
const { storeSettings } = useAppConfig();

const initialTab = product.description ? 0 : 1;
const show = ref(initialTab);
</script>

<template>
  <div>
    <nav class="flex gap-8 border-b border-gray-200 tabs">
      <button v-if="product.description" type="button" :class="show === 0 ? 'active' : ''" @click.prevent="show = 0">
        {{ $t('shop.productDescription') }}
      </button>
      <button v-if="storeSettings.showReviews" type="button" class="flex items-center gap-2" :class="show === 1 ? 'active' : ''" @click.prevent="show = 1">
        {{ $t('shop.reviews') }}
        <span class="bg-primary rounded-full text-white leading-none min-w-4.5 p-0.75 text-[12px] inline-flex justify-center items-center">
          {{ product.reviewCount }}
        </span>
      </button>
    </nav>
    <div class="tab-contents">
      <div v-if="show === 0 && product.description" class="mt-8 font-light prose dark:prose-invert" v-html="product.description" />
      <ProductReviews v-if="show === 1" :product="product" />
    </div>
  </div>
</template>

<style scoped>
@reference "#tailwind";

.tabs {
  @apply border-gray-200 dark:border-gray-700;
}

.tabs button {
  @apply border-transparent border-b-2 text-lg pb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200;
  margin-bottom: -1px;
}

.tabs button.active {
  @apply border-primary text-primary;
}

.tab-contents {
  @apply dark:text-gray-300;
}
</style>

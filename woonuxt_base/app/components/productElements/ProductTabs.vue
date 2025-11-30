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
    <nav class="border-b flex gap-8 tabs">
      <button v-if="product.description" type="button" :class="show === 0 ? 'active' : ''" @click.prevent="show = 0">
        {{ $t('shop.productDescription') }}
      </button>
      <button v-if="storeSettings.showReviews" type="button" class="flex items-center gap-2" :class="show === 1 ? 'active' : ''" @click.prevent="show = 1">
        {{ $t('shop.reviews') }}
        <span class="bg-primary rounded-full text-white leading-none min-w-[18px] p-[3px] text-[12px] inline-flex justify-center items-center">{{
          product.reviewCount
        }}</span>
      </button>
    </nav>
    <div class="tab-contents">
      <div v-if="show === 0 && product.description" class="font-light mt-8 prose" v-html="product.description" />
      <ProductReviews v-if="show === 1" :product="product" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.tabs button {
  @apply border-transparent border-b-2 text-lg pb-8;
  margin-bottom: -1px;
}

.tabs button.active {
  @apply border-primary text-primary;
}
</style>

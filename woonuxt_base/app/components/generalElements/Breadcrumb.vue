<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const { product } = defineProps<{ product: Product }>();

// TODO fetch perma link from WP API
const productCategoryPermallink = runtimeConfig?.public?.PRODUCT_CATEGORY_PERMALINK || '/product-category/';
const primaryCategory = computed(() => product.productCategories?.nodes[0]);
const format = computed(() => [
  { name: 'Products', slug: '/products' },
  {
    name: primaryCategory.value?.name,
    slug: `${String(productCategoryPermallink)}${primaryCategory.value?.slug}`,
  },
  { name: product.name },
]);
</script>

<template>
  <div class="flex text-sm leading-none text-gray-400 gap-1 items-center">
    <span>
      <NuxtLink to="/" class="hover:text-primary">{{ $t('messages.general.home') }}</NuxtLink>
      <span> /</span>
    </span>
    <span v-for="(link, i) in format" :key="link.name || i">
      <NuxtLink v-if="link.slug" :to="decodeURIComponent(link.slug)" class="hover:text-primary">{{ link.name }}</NuxtLink>
      <span v-else class="text-gray-800">{{ link.name }}</span>
      <span v-if="i + 1 < format.length"> /</span>
    </span>
  </div>
</template>

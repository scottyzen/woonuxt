<script setup lang="ts">
const { removeFromWishlist } = useWishlist();
const { product } = defineProps<{ product: Product }>();
</script>

<template>
  <li class="flex py-4 gap-4 items-center">
    <NuxtLink v-if="product.slug" :to="`/product/${decodeURIComponent(product.slug)}`">
      <img
        v-if="product?.image?.cartSourceUrl"
        class="rounded-lg object-cover h-16 w-16"
        :src="product.image?.cartSourceUrl || product.image?.sourceUrl || '/images/placeholder.jpg'"
        :alt="product.image?.altText || product.name || 'Product image'"
        :title="product.image?.altText || product.name || 'Product image'"
        width="100"
        height="120"
        loading="lazy" />
    </NuxtLink>
    <div>
      <NuxtLink v-if="product.slug" class="text-lg leading-tight" :to="`/product/${decodeURIComponent(product.slug)}`">{{ product.name }}</NuxtLink>
      <ProductPrice :sale-price="product.salePrice" :regular-price="product.regularPrice" class="ml-auto" />
    </div>
    <div class="ml-auto">
      <button v-if="product.databaseId" title="Remove Item" @click="removeFromWishlist(product.databaseId)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368" />
        </svg>
      </button>
    </div>
  </li>
</template>

<template>
  <li class="flex py-4 gap-4 items-center">
    <button title="Remove Item" @click="removeFromList(product.databaseId)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368" />
      </svg>
    </button>
    <NuxtLink :to="`/product/${product.slug}`">
      <img
        v-if="product.image"
        class="rounded-lg object-cover h-20 w-20"
        :src="product.image.cartSourceUrl || product.image.sourceUrl"
        :alt="product.image.altText || product.name"
        :title="product.image.altText || product.name"
        width="100"
        height="120" />
    </NuxtLink>
    <NuxtLink class="text-lg leading-tight" :to="`/product/${product.slug}`">{{ product.name }}</NuxtLink>
    <ProductPrice :sale-price="product.salePrice" :regular-price="product.regularPrice" class="ml-auto" />
  </li>
</template>

<script setup>
const { removeFromList } = useWishlist();
const props = defineProps({
  product: { type: Object, required: true },
});
</script>

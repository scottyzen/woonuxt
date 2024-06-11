<script setup lang="ts">
const { theList } = useWishlist();
</script>

<template>
  <div class="mx-auto my-4 min-h-[600px] w-full max-w-3xl px-4">
    <h1 class="py-4 my-4 text-2xl font-semibold text-center border-b">{{ $t('messages.shop.wishlist') }}</h1>
    <client-only>
      <ul v-if="theList.length" class="grid my-8 divide-y divide-gray-100">
        <LazyWishListItem v-for="product in theList" :key="product.databaseId" :product="product" />
      </ul>
      <div v-else class="flex text-center min-h-[600px] text-gray-500 items-center justify-center">
        <p>{{ $t('messages.shop.wishlistNoItems') }}</p>
      </div>
    </client-only>
  </div>
</template>

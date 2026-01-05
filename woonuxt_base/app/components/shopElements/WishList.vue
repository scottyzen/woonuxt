<script setup lang="ts">
const { theList } = useWishlist();
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow min-h-[400px] w-full p-4 md:p-12 justify-center items-start">
    <div class="container">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">{{ $t('shop.wishlist') }}</h1>
        <span class="text-gray-400 dark:text-gray-500">Items: {{ theList.length }}</span>
      </div>
      <client-only>
        <ul v-if="theList.length" class="grid divide-y divide-gray-100 dark:divide-gray-700">
          <WishListItem v-for="product in theList" :key="product.databaseId" :product="product" />
        </ul>
        <div v-else class="flex text-center min-h-[600px] text-gray-500 dark:text-gray-400 items-center justify-center">
          <p>{{ $t('shop.wishlistNoItems') }}</p>
        </div>
      </client-only>
    </div>
  </div>
</template>

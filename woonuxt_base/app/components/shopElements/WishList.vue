<script setup lang="ts">
const { theList } = useWishlist();
</script>

<template>
  <div class="bg-white rounded-lg shadow min-h-[400px] w-full p-4 md:p-12 justify-center items-start">
    <div class="container">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold">{{ $t('messages.shop.wishlist') }}</h1>
        <span class="text-gray-400">Items: {{ theList.length }}</span>
      </div>
      <client-only>
        <ul v-if="theList.length" class="grid divide-y divide-gray-100">
          <WishListItem v-for="product in theList" :key="product.databaseId" :product="product" />
        </ul>
        <div v-else class="flex text-center min-h-[600px] text-gray-500 items-center justify-center">
          <p>{{ $t('messages.shop.wishlistNoItems') }}</p>
        </div>
      </client-only>
    </div>
  </div>
</template>

<script setup>
const { theList } = useWishlist();
</script>

<template>
  <div class="mx-auto my-4 min-h-[600px] w-full max-w-3xl px-4">
    <h1 class="border-b font-semibold my-4 text-center py-4 text-2xl">{{ $t('messages.shop.wishlist') }}</h1>
    <client-only>
      <ul v-if="theList.length" class="divide-y divide-gray-100 my-8 grid">
        <WishListItem v-for="product in theList" :key="product.databaseId" :product="product" />
      </ul>
      <div v-else class="flex text-center min-h-96 text-gray-500 items-center justify-center">
        <p>{{ $t('messages.shop.wishlistNoItems') }}</p>
      </div>
    </client-only>
  </div>
</template>

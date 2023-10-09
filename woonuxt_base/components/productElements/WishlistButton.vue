<script setup lang="ts">
const { addToWishlist, removeFromWishlist, isInList } = useWishlist();

const props = defineProps<{ product: Product }>();

const isWishlisted = computed(() => isInList(props.product.databaseId));

const toggleWishlist = () => (isWishlisted.value ? removeFromWishlist(props.product.databaseId) : addToWishlist(props.product));
</script>

<template>
  <a class="cursor-pointer flex mt-4 text-sm text-gray-400 gap-2 items-center" @click="toggleWishlist">
    <Icon v-if="isWishlisted" name="ion:heart" size="18" class="text-red-400" />
    <Icon v-else name="ion:heart-outline" size="18" />
    <span>{{ isWishlisted ? $t('messages.shop.wishlistRemove') : $t('messages.shop.wishlistAdd') }}</span>
  </a>
</template>

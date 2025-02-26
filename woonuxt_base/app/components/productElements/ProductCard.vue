<script setup lang="ts">
import { computed } from 'vue';

// Define props with validation and default values
const props = defineProps({
  product: {
    type: Object,
    required: true,
    // Add default to prevent undefined errors
    default: () => ({
      name: 'Product',
      slug: '',
      price: '',
      regularPrice: '',
      salePrice: '',
      onSale: false,
      stockStatus: 'IN_STOCK',
      image: null
    })
  }
});

// Add defensive checks
const productSlug = computed(() => {
  return props.product?.slug || '';
});

const productName = computed(() => {
  return props.product?.name || 'Product';
});

const productImage = computed(() => {
  return props.product?.image || null;
});
</script>

<template>
  <NuxtLink 
    :to="productSlug ? `/product/${productSlug}` : '#'" 
    class="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-md"
  >
    <!-- Image with fallback -->
    <div class="aspect-h-1 aspect-w-1 bg-gray-50 sm:aspect-none h-48 sm:h-60 overflow-hidden">
      <img
        v-if="productImage && productImage.sourceUrl"
        :src="productImage.sourceUrl"
        :alt="productImage.altText || productName"
        class="h-full w-full object-contain object-center sm:h-full sm:w-full transition-transform duration-500 group-hover:scale-105"
      />
      <div v-else class="flex h-full w-full items-center justify-center bg-gray-100">
        <span class="text-gray-400">No image</span>
      </div>
    </div>

    <!-- Product details with defensive rendering -->
    <div class="flex flex-1 flex-col space-y-2 p-4 bg-white">
      <h3 class="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{{ productName }}</h3>
      
      <div v-if="product && product.price" class="flex-1 flex items-end">
        <p class="text-base font-medium text-gray-900" v-html="product.price"></p>
        <p v-if="product.onSale && product.regularPrice" class="ml-2 text-sm text-gray-500 line-through" v-html="product.regularPrice"></p>
      </div>
      
      <div v-if="product && product.stockStatus" class="text-xs">
        <span v-if="product.stockStatus === 'IN_STOCK'" class="text-green-600 font-medium">In Stock</span>
        <span v-else-if="product.stockStatus === 'OUT_OF_STOCK'" class="text-red-600 font-medium">Out of Stock</span>
        <span v-else class="text-yellow-600 font-medium">{{ product.stockStatus }}</span>
      </div>
      
      <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span class="bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">View</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
}
</style>

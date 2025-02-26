<script setup lang="ts">
import { ref, computed } from 'vue';

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

const showQuickView = ref(false);

const toggleQuickView = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  showQuickView.value = !showQuickView.value;
};

const closeQuickView = () => {
  showQuickView.value = false;
};

// Add defensive checks
const productSlug = computed(() => {
  return props.product?.slug || '';
});

const productName = computed(() => {
  return props.product?.name || 'Product';
});

const productImage = computed(() => {
  return props.product?.image?.sourceUrl || '/images/placeholder.svg';
});

const productPrice = computed(() => {
  return props.product?.price || '';
});

const productRegularPrice = computed(() => {
  return props.product?.regularPrice || '';
});

const productSalePrice = computed(() => {
  return props.product?.salePrice || '';
});

const productOnSale = computed(() => {
  return props.product?.onSale || false;
});

const productInStock = computed(() => {
  return props.product?.stockStatus === 'IN_STOCK';
});

const productLink = computed(() => {
  return `/product/${props.product?.slug || ''}`;
});
</script>

<template>
  <div class="product-card relative group">
    <NuxtLink :to="productLink" class="block h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div class="relative overflow-hidden bg-gray-50 pb-[100%]">
        <img
          v-if="productImage"
          :src="productImage"
          :alt="productName"
          class="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        <!-- Quick View Button -->
        <button 
          @click="toggleQuickView" 
          class="absolute bottom-3 right-3 bg-white/90 hover:bg-blue-600 hover:text-white text-gray-700 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
          title="Quick View"
        >
          <Icon name="ion:eye-outline" size="18" />
        </button>
        
        <!-- Sale Badge -->
        <div v-if="productOnSale" class="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md">
          Sale
        </div>
        
        <!-- Out of Stock Badge -->
        <div v-if="!productInStock" class="absolute top-2 right-2 bg-gray-700 text-white text-xs font-medium px-2 py-1 rounded-md">
          Out of Stock
        </div>
      </div>
      <div class="p-3 bg-white">
        <h3 class="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">{{ productName }}</h3>
        <div class="mt-2 flex items-center justify-between">
          <div>
            <span v-if="productOnSale" class="text-sm font-medium text-gray-900">{{ productSalePrice }}</span>
            <span v-if="productOnSale" class="ml-1 text-xs text-gray-500 line-through">{{ productRegularPrice }}</span>
            <span v-else class="text-sm font-medium text-gray-900">{{ productPrice }}</span>
          </div>
          <span class="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">View</span>
        </div>
      </div>
    </NuxtLink>
    
    <!-- Quick View Modal -->
    <Teleport to="body">
      <div v-if="showQuickView" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click="closeQuickView">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto" @click.stop>
          <div class="flex justify-between items-center p-4 border-b">
            <h2 class="text-lg font-medium text-gray-900">{{ productName }}</h2>
            <button @click="closeQuickView" class="text-gray-500 hover:text-gray-700">
              <Icon name="ion:close-outline" size="24" />
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div class="aspect-square bg-gray-50 rounded-md overflow-hidden">
              <img :src="productImage" :alt="productName" class="w-full h-full object-cover object-center" />
            </div>
            <div class="flex flex-col">
              <div v-if="productOnSale" class="mb-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  On Sale
                </span>
              </div>
              <div class="mb-4">
                <div class="flex items-baseline">
                  <span v-if="productOnSale" class="text-2xl font-bold text-gray-900">{{ productSalePrice }}</span>
                  <span v-if="productOnSale" class="ml-2 text-lg text-gray-500 line-through">{{ productRegularPrice }}</span>
                  <span v-else class="text-2xl font-bold text-gray-900">{{ productPrice }}</span>
                </div>
              </div>
              <div class="prose prose-sm text-gray-600 mb-6 max-w-none" v-if="product.shortDescription" v-html="product.shortDescription"></div>
              <div class="mt-auto space-y-3">
                <NuxtLink 
                  :to="productLink" 
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Full Details
                </NuxtLink>
                <button 
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  :disabled="!productInStock"
                >
                  <Icon name="ion:cart-outline" class="mr-2" size="18" />
                  {{ productInStock ? 'Add to Cart' : 'Out of Stock' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
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

.product-card:hover {
  z-index: 10;
}
</style>

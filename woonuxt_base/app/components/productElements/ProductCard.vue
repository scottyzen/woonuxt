<script setup lang="ts">
import type { PropType } from 'vue';
import type { Product } from '~/types';

defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  }
});
</script>

<template>
  <NuxtLink :to="`/product/${product.slug}`" class="product-card group">
    <div class="relative overflow-hidden rounded-lg">
      <ProductImage 
        :image="product.image" 
        :width="400" 
        :height="400" 
        loading="lazy" 
      />
      <SaleBadge :node="product" class="absolute top-2 right-2" />
    </div>
    
    <div class="mt-3 flex flex-col">
      <h3 class="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
        {{ product.name }}
      </h3>
      <div class="mt-1 flex items-center">
        <ProductPrice :product="product" class="text-sm font-medium" />
      </div>
      <div class="mt-1">
        <ProductRating :rating="product.averageRating" :count="product.reviewCount" />
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
}
</style>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
// @ts-ignore
import { useAppConfig, useAsyncGql, useSeoMeta } from '#imports';
// @ts-ignore
import { ProductsOrderByEnum } from '#constants';

const { siteName, description, shortDescription, siteImage } = useAppConfig();

// @ts-ignore: Top-level await allowed in Nuxt SFC
const { data, pending: categoriesPending } = await useAsyncGql('getProductCategories', { first: 6 });
const productCategories = data.value?.productCategories?.nodes || [];

// Use ref to track loading state
const isLoading = ref(true);
const popularProducts = ref<any[]>([]);

// Spinner customization options
const spinnerOptions = {
  // Image URL
  imageUrl: 'https://modaprimeusa.com/wp-content/uploads/2024/04/cropped-pillparts2.png',
  
  // Animation speeds (in seconds)
  spinSpeed: 2,     // How fast the image rotates
  pulseSpeed: 3,    // How fast the image pulses
  
  // Size (in pixels)
  spinnerSize: 100,  // Size of the spinner
  
  // Effects
  enablePulse: true,
  enableShadow: true
};

// Fetch popular products
const fetchPopularProducts = async () => {
  isLoading.value = true;
  try {
    // @ts-ignore: Top-level await allowed in Nuxt SFC
    const { data: productData } = await useAsyncGql('getProducts', { 
      first: 5, 
      orderby: [{ field: ProductsOrderByEnum.POPULARITY as any }]
    });
    popularProducts.value = productData.value?.products?.edges?.map(edge => edge.node) || [];
  } catch (error) {
    console.error('Error fetching popular products:', error);
  } finally {
    isLoading.value = false;
  }
};

// Call the fetch function
onMounted(() => {
  fetchPopularProducts();
});

useSeoMeta({
  title: `Home`,
  ogTitle: siteName,
  description: description,
  ogDescription: shortDescription,
  ogImage: siteImage,
  twitterCard: `summary_large_image`,
});
</script>

<template>
  <main>
    <HeroBanner />
  
    <section class="container my-16">
      <div class="flex items-end justify-between">
        <h2 class="text-lg font-semibold md:text-2xl">{{ $t('messages.shop.popularProducts') }}</h2>
        <NuxtLink class="text-primary" to="/products">{{ $t('messages.general.viewAll') }}</NuxtLink>
      </div>
      
      <!-- ModaPrime Pill Parts Spinner -->
      <div v-if="isLoading" class="flex justify-center items-center py-16">
        <div class="pill-spinner-container">
          <!-- Pill image spinner -->
          <div class="pill-spinner" :style="{
            width: spinnerOptions.spinnerSize + 'px',
            height: spinnerOptions.spinnerSize + 'px',
            animationDuration: spinnerOptions.spinSpeed + 's'
          }">
            <img 
              :src="spinnerOptions.imageUrl" 
              alt="Loading" 
              class="pill-image"
              :class="{ 'pulse-effect': spinnerOptions.enablePulse, 'shadow-effect': spinnerOptions.enableShadow }"
              :style="{ animationDuration: spinnerOptions.pulseSpeed + 's' }">
          </div>
          
          <!-- Loading text -->
          <div class="loading-text">
            {{ $t('messages.general.loading') || 'Loading...' }}
          </div>
        </div>
      </div>
      
      <!-- Products display when loaded -->
      <ProductRow 
        v-else-if="popularProducts && popularProducts.length > 0" 
        :products="popularProducts" 
        class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mt-8" 
      />
      
      <!-- No products found message -->
      <div v-else class="text-center py-8 text-gray-500">
        {{ $t('messages.shop.noProductsFound') || 'No products found' }}
      </div>
    </section>
  </main>
</template>

<style scoped>
.brand img {
  max-height: min(8vw, 120px);
  object-fit: contain;
  object-position: center;
}

/* ModaPrime Pill Parts Spinner Animation */
.pill-spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pill-spinner {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 12px;
  animation: spin 2s linear infinite;
  transform-origin: center center;
}

.pill-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.pulse-effect {
  animation: pulse 3s ease-in-out infinite;
}

.shadow-effect {
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.3));
}

.loading-text {
  font-size: 14px;
  color: var(--color-primary, #4f46e5);
  margin-top: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
</style>

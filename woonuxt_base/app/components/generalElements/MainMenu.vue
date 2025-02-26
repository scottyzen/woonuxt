<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

const { wishlistLink } = useAuth();
const route = useRoute();

const isActive = (path: string): boolean => {
  return route.path === path;
};
</script>

<template>
  <nav class="flex items-center gap-6">
    <NuxtLink 
      to="/" 
      class="relative py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
      :class="{ 'text-blue-600 font-medium': isActive('/') }"
    >
      <span>{{ $t('messages.general.home') }}</span>
      <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" :class="{ 'w-full': isActive('/') }"></span>
    </NuxtLink>
    
    <NuxtLink 
      to="/products" 
      class="relative py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
      :class="{ 'text-blue-600 font-medium': isActive('/products') }"
    >
      <span>{{ $t('messages.general.allProducts') }}</span>
      <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" :class="{ 'w-full': isActive('/products') }"></span>
    </NuxtLink>
    
    <!-- <NuxtLink to="/categories">{{ $t('messages.shop.category', 2) }}</NuxtLink> -->
    
    <NuxtLink 
      to="/contact" 
      class="relative py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
      :class="{ 'text-blue-600 font-medium': isActive('/contact') }"
    >
      <span>{{ $t('messages.general.contact') }}</span>
      <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" :class="{ 'w-full': isActive('/contact') }"></span>
    </NuxtLink>
    
    <!-- <NuxtLink class="lg:hidden" :to="wishlistLink" :prefetch="false">Wishlist</NuxtLink> -->
    
    <NuxtLink 
      class="lg:hidden relative py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200" 
      to="/my-account" 
      :prefetch="false"
      :class="{ 'text-blue-600 font-medium': isActive('/my-account') }"
    >
      <span>My Account</span>
      <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" :class="{ 'w-full': isActive('/my-account') }"></span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
nav a:hover span:last-child {
  width: 100%;
}
</style>

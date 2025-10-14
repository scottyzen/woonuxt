<script setup lang="ts">
const { wishlistLink, navigateToLogin } = useAuth();
const route = useRoute();
</script>

<template>
  <nav>
    <NuxtLink to="/">{{ $t('messages.general.home') }}</NuxtLink>
    <NuxtLink to="/products">{{ $t('messages.general.products') }}</NuxtLink>
    <NuxtLink to="/categories">{{ $t('messages.shop.category', 2) }}</NuxtLink>
    <NuxtLink to="/contact">{{ $t('messages.general.contact') }}</NuxtLink>
    <NuxtLink class="lg:hidden" :to="wishlistLink" :prefetch="false">Wishlist</NuxtLink>
    <NuxtLink class="lg:hidden" to="/my-account" @click="navigateToLogin(route.fullPath)" :prefetch="false">My Account</NuxtLink>
  </nav>
</template>

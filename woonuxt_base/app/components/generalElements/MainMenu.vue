<script setup lang="ts">
const { wishlistLink, navigateToLogin } = useAuth();
const route = useRoute();



  
</script>

<template>
  
  <nav>
    <NuxtLink to="/">{{ $t('general.home') }}</NuxtLink>
<!--    <NuxtLink to="/products">{{ $t('general.products') }}</NuxtLink>
    <NuxtLink to="/categories">{{ $t('shop.category', 2) }}</NuxtLink>
    <NuxtLink to="/contact">{{ $t('general.contact') }}</NuxtLink>-->
    <NuxtLink to="/dames" class="menu-item">Dames</NuxtLink>
    <NuxtLink to="/heren" class="menu-item">Heren</NuxtLink>
    <NuxtLink to="/jongens" class="menu-item">Jongens</NuxtLink>
    <NuxtLink to="/meisjes" class="menu-item">Meisjes</NuxtLink>
    <NuxtLink to="/babys" class="menu-item">Baby's</NuxtLink>
   <!-- <NuxtLink class="lg:hidden" :to="wishlistLink" :prefetch="false">Wishlist</NuxtLink>
    <NuxtLink class="lg:hidden" to="/my-account" @click="navigateToLogin(route.fullPath)" :prefetch="false">My Account</NuxtLink>-->
  </nav>
</template>

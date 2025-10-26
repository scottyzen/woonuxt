<script setup lang="ts">
const { wishlistLink, navigateToLogin } = useAuth();
const route = useRoute();

  import { useMainMenu } from '~/composables/useMainMenu'
const { items: menuItems } = useMainMenu()


  
</script>

<template>

  <nav class="flex gap-6 text-sm font-medium">
  <template v-for="item in menuItems" :key="item.id">
    <div class="relative group">
      <NuxtLink :to="item.path" class="hover:text-primary">
        {{ item.label }}
      </NuxtLink>

      <!-- Submenu -->
      <div
        v-if="item.childItems?.nodes?.length"
        class="absolute hidden group-hover:block bg-white shadow p-4 mt-2 z-50"
      >
        <ul class="space-y-2">
          <li v-for="child in item.childItems.nodes" :key="child.id">
            <NuxtLink :to="child.path" class="hover:underline">
              {{ child.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </template>
</nav>

  
  <nav>
    <NuxtLink to="/">{{ $t('general.home') }}</NuxtLink>
<!--    <NuxtLink to="/products">{{ $t('general.products') }}</NuxtLink>
    <NuxtLink to="/categories">{{ $t('shop.category', 2) }}</NuxtLink>
    <NuxtLink to="/contact">{{ $t('general.contact') }}</NuxtLink>-->
    <NuxtLink to="/categorie/dames" class="menu-item">Dames</NuxtLink>
    <NuxtLink to="/categorie/heren" class="menu-item">Heren</NuxtLink>
    <NuxtLink to="/categorie/jongens" class="menu-item">Jongens</NuxtLink>
    <NuxtLink to="/categorie/meisjes" class="menu-item">Meisjes</NuxtLink>
    <NuxtLink to="/categorie/babys" class="menu-item">Baby's</NuxtLink>
   <!-- <NuxtLink class="lg:hidden" :to="wishlistLink" :prefetch="false">Wishlist</NuxtLink>
    <NuxtLink class="lg:hidden" to="/my-account" @click="navigateToLogin(route.fullPath)" :prefetch="false">My Account</NuxtLink>-->
  </nav>
</template>

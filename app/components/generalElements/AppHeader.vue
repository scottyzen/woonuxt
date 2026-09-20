<script setup lang="ts">
const { isShowingSearch } = useSearching();
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-[#e3eadc] bg-white">
    <div class="hidden bg-[#0d5134] text-xs text-white lg:block">
      <div class="container grid grid-cols-[1fr_auto_1fr] items-center py-2.5">
        <span class="text-white/85">Call us: +123-456-789</span>
        <span>Sign up and get <b class="text-[#f6c51e]">25% off</b> your first plant order. <NuxtLink to="/my-account" class="ml-2 font-bold text-[#f6c51e] underline underline-offset-2">Sign up now</NuxtLink></span>
        <div class="flex justify-end gap-3 text-[#f6c51e]"><Icon name="ion:logo-facebook" /><Icon name="ion:logo-instagram" /><Icon name="ion:logo-pinterest" /><Icon name="ion:logo-youtube" /></div>
      </div>
    </div>
    <div class="container flex min-h-24 items-center justify-between gap-6 py-4">
      <div class="flex items-center gap-3"><MenuTrigger class="lg:hidden" /><Logo /></div>
      <nav class="hidden items-center gap-8 text-sm font-bold text-[#193d2b] lg:flex" aria-label="Main navigation">
        <NuxtLink to="/" class="hover:text-[#d49f00]">Home</NuxtLink>
        <NuxtLink to="/products" class="hover:text-[#d49f00]">Plants</NuxtLink>
        <NuxtLink to="/categories" class="hover:text-[#d49f00]">Pots & Accessories</NuxtLink>
        <NuxtLink to="/products?filter=category[seeds]" class="hover:text-[#d49f00]">Seeds</NuxtLink>
        <NuxtLink to="/about" class="hover:text-[#d49f00]">About</NuxtLink>
        <NuxtLink to="/blog" class="hover:text-[#d49f00]">Blog</NuxtLink>
      </nav>
      <div class="flex items-center gap-4 text-[#183724]">
        <ProductSearch class="hidden w-52 xl:flex" />
        <SearchTrigger />
        <NuxtLink to="/wishlist" class="hidden items-center sm:inline-flex" title="Wishlist" aria-label="Wishlist"><Icon name="ion:heart-outline" size="22" /></NuxtLink>
        <CartTrigger />
        <NuxtLink to="/my-account" class="inline-flex items-center" title="My account" aria-label="My account"><Icon name="ion:person-outline" size="22" /></NuxtLink>
      </div>
    </div>
    <Transition name="scale-y" mode="out-in"><div v-if="isShowingSearch" class="container mb-3 lg:hidden"><ProductSearch class="flex w-full" /></div></Transition>
  </header>
</template>

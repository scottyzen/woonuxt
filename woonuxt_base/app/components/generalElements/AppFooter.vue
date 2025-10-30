<script setup lang="ts">
const { wooNuxtVersionInfo } = useHelpers()
const { wishlistLink } = useAuth()
</script>

<template>
  <footer class="bg-white order-last">
    <div class="container flex flex-wrap justify-between gap-12 my-24 md:gap-24">
      <!-- Logo + beschrijving -->
      <div class="mr-auto">
        <Logo />
        <WebsiteShortDescription />
      </div>

      <!-- Footer blok 1 -->
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">Categorieën</div>
        <div class="text-sm">
          <NuxtLink to="/dames" class="py-1.5 block hover:underline">Dames</NuxtLink>
          <NuxtLink to="/heren" class="py-1.5 block hover:underline">Heren</NuxtLink>
          <NuxtLink to="/jongens" class="py-1.5 block hover:underline">Jongens</NuxtLink>
          <NuxtLink to="/meisjes" class="py-1.5 block hover:underline">Meisjes</NuxtLink>
          <NuxtLink to="/babys" class="py-1.5 block hover:underline">Baby’s</NuxtLink>
        </div>
      </div>

      <!-- Footer blok 2 -->
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">Informatie</div>
        <div class="text-sm">
          <NuxtLink to="/veel-gestelde-vragen" class="py-1.5 block hover:underline">Veelgestelde vragen</NuxtLink>
          <NuxtLink to="/merken" class="py-1.5 block hover:underline">Merken</NuxtLink>
          <NuxtLink to="/sample-page" class="py-1.5 block hover:underline">Sample Page</NuxtLink>
        </div>
      </div>

      <!-- Footer blok 3 -->
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">Klantenservice</div>
        <div class="text-sm">
          <NuxtLink to="/mijn-account" class="py-1.5 block hover:underline">Mijn account</NuxtLink>
          <NuxtLink :to="wishlistLink" class="py-1.5 block hover:underline">Wishlist</NuxtLink>
          <NuxtLink to="/contact" class="py-1.5 block hover:underline">Contact</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Onderste gedeelte -->
    <div class="container border-t pt-4 pb-6 flex flex-col items-center justify-center text-sm text-gray-500">
      <p class="mb-2">
        &copy; {{ new Date().getFullYear() }} Kledingzoeken.nl - 2025
      </p>
      <SocialIcons />
    </div>
  </footer>
</template>

<style scoped lang="postcss">
a {
  @apply hover:underline;
}
</style>

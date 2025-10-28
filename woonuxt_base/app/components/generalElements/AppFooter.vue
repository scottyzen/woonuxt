<script setup lang="ts">
import GetFooterMenus from '~/graphql/queries/getFooterMenus.gql'

const { wooNuxtVersionInfo } = useHelpers()
const { wishlistLink } = useAuth()

// 🔹 Haal alle drie footer-menu's op vanuit WordPress
const { data, pending, error } = await useAsyncGql(GetFooterMenus)

// Reactieve structuur voor herbruikbaarheid
const menus = computed(() => ({
  footer1: data.value?.footer1?.nodes || [],
  footer2: data.value?.footer2?.nodes || [],
  footer3: data.value?.footer3?.nodes || [],
}))
</script>

<template>
  <footer class="bg-white order-last">
    <div class="container flex flex-wrap justify-between gap-12 my-24 md:gap-24">
      <!-- Logo + beschrijving -->
      <div class="mr-auto">
        <Logo />
        <WebsiteShortDescription />
      </div>

      <!-- Dynamische menu's -->
      <div
        v-for="(menuItems, key) in menus"
        :key="key"
        class="w-3/7 lg:w-auto"
      >
        <div class="mb-1 font-semibold capitalize">
          {{ key.replace('footer', 'Menu ') }}
        </div>

        <div class="text-sm">
          <template v-if="menuItems.length">
            <NuxtLink
              v-for="item in menuItems"
              :key="item.id"
              :to="item.url"
              class="py-1.5 block hover:underline"
            >
              {{ item.label }}
            </NuxtLink>
          </template>
          <div v-else class="text-gray-400 text-xs italic">
            Nog geen items
          </div>
        </div>
      </div>
    </div>

    <!-- Onderrand -->
    <div class="container border-t flex items-center justify-center mb-4">
      <SocialIcons class="ml-auto" />
    </div>
  </footer>
</template>

<style scoped lang="postcss">
a {
  @apply hover:underline;
}
</style>

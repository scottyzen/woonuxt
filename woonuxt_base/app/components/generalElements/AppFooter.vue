<script setup lang="ts">
import GetFooterMenus from '~/graphql/queries/getFooterMenus.gql'

const { wooNuxtVersionInfo } = useHelpers()
const { wishlistLink } = useAuth()

// 🔹 Haal de drie footermenu’s op via WPGraphQL
const { data, pending, error } = await useAsyncGql(GetFooterMenus, {}, { revalidate: 3600 })

// 🔹 Combineer alle menu’s in één array
const footerMenus = computed(() => {
  return [
    data.value?.footer1,
    data.value?.footer2,
    data.value?.footer3
  ].filter(Boolean)
})
</script>

<template>
  <footer class="bg-white order-last">
    <!-- Bovenste gedeelte met logo en menu’s -->
    <div class="container flex flex-wrap justify-between gap-12 my-24 md:gap-24">
      <!-- Logo + beschrijving -->
      <div class="mr-auto">
        <Logo />
        <WebsiteShortDescription />
      </div>

      <!-- Dynamische footer menu’s -->
      <div
        v-for="menu in footerMenus"
        :key="menu.slug"
        class="w-3/7 lg:w-auto"
      >
        <div class="mb-1 font-semibold">{{ menu.name }}</div>
        <div class="text-sm">
          <template v-if="menu.menuItems?.nodes?.length">
            <NuxtLink
              v-for="item in menu.menuItems.nodes"
              :key="item.id"
              :to="item.url.replace('https://wp.kledingzoeken.nl', '')"
              class="py-1.5 block hover:underline"
            >
              {{ item.label }}
            </NuxtLink>
          </template>
          <div v-else class="text-gray-400 text-xs italic">Nog geen items</div>
        </div>
      </div>
    </div>

    <!-- Onderste gedeelte -->
    <div class="container border-t pt-4 pb-6 flex flex-col items-center justify-center text-sm text-gray-500">
      <p class="mb-2">&copy; {{ new Date().getFullYear() }} Kledingzoeken.nl - 2025</p>
      <SocialIcons />
    </div>
  </footer>
</template>

<style scoped lang="postcss">
a {
  @apply hover:underline;
}
</style>

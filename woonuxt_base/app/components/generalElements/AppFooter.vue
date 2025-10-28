<script setup lang="ts">
import GetFooterMenus from '~/graphql/queries/getFooterMenus.gql'

const { wooNuxtVersionInfo } = useHelpers()
const { wishlistLink } = useAuth()

// 🔹 Data ophalen via WooNuxt GraphQL helper
const { data, pending, error } = await useAsyncGql(GetFooterMenus, {}, { revalidate: 3600 })

// 🔹 Combineer menu’s, alleen als ze bestaan
const footerMenus = computed(() => {
  const f1 = data.value?.footer1 || null
  const f2 = data.value?.footer2 || null
  const f3 = data.value?.footer3 || null
  return [f1, f2, f3].filter(Boolean)
})

// 🔹 Debug: laat zien wat er binnenkomt
if (import.meta.dev) {
  watchEffect(() => {
    console.log('📦 Footer menus:', data.value)
  })
}
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
      <p class="mb-2">&copy; {{ new Date().getFullYear() }} Kledingzoeken.nl</p>
      <SocialIcons />
    </div>
  </footer>
</template>

<style scoped lang="postcss">
a {
  @apply hover:underline;
}
</style>

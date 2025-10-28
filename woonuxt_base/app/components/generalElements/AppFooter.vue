<script setup lang="ts">
import GetFooterMenus from '~/graphql/queries/getFooterMenus.gql'

const { wooNuxtVersionInfo } = useHelpers()
const { wishlistLink } = useAuth()

// 🔹 Haal alle menu's op via WPGraphQL
const { data, pending, error } = await useAsyncGql(GetFooterMenus)

const footerMenus = computed(() => {
  if (!data.value?.menus?.nodes) return []

  // Filter enkel onze 3 footermenu's
  const wanted = ['Footer 1', 'Footer 2', 'Footer 3']
  return data.value.menus.nodes.filter(menu => wanted.includes(menu.name))
})
</script>

<template>
  <footer class="bg-white order-last">
    <div class="container flex flex-wrap justify-between gap-12 my-24 md:gap-24">
      <!-- Logo + beschrijving -->
      <div class="mr-auto">
        <Logo />
        <WebsiteShortDescription />
      </div>

      <!-- Dynamische footer menu's -->
      <div
        v-for="menu in footerMenus"
        :key="menu.id"
        class="w-3/7 lg:w-auto"
      >
        <div class="mb-1 font-semibold">{{ menu.name }}</div>
        <div class="text-sm">
          <template v-if="menu.menuItems?.nodes?.length">
            <NuxtLink
              v-for="item in menu.menuItems.nodes"
              :key="item.id"
              :to="item.url"
              class="py-1.5 block hover:underline"
            >
              {{ item.label }}
            </NuxtLink>
          </template>
          <div v-else class="text-gray-400 text-xs italic">Nog geen items</div>
        </div>
      </div>
    </div>

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

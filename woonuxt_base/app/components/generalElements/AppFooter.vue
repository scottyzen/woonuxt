<script setup lang="ts">
import GetFooterMenus from '~/graphql/queries/getFooterMenus.gql'

// WooNuxt helpers (blijven staan)
const { wooNuxtVersionInfo } = useHelpers()
const { wishlistLink } = useAuth()

// 🔹 Haal de drie WordPress-menu’s op
const { data, pending, error } = await useAsyncGql(GetFooterMenus)

const menus = computed(() => ({
  footer1: data.value?.footer1?.nodes || [],
  footer2: data.value?.footer2?.nodes || [],
  footer3: data.value?.footer3?.nodes || [],
}))

// Optionele vaste titels per kolom
const titles = {
  footer1: 'Informatie',
  footer2: 'Klantenservice',
  footer3: 'Over ons',
}
</script>

<template>
  <footer class="bg-white order-last">
    <div class="container flex flex-wrap justify-between gap-12 my-24 md:gap-24">
      <!-- 🔸 Logo + korte beschrijving -->
      <div class="mr-auto">
        <Logo />
        <WebsiteShortDescription />
      </div>

      <!-- 🔸 Dynamische footer menu’s uit WordPress -->
      <div
        v-for="(menuItems, key) in menus"
        :key="key"
        class="w-3/7 lg:w-auto"
      >
        <div class="mb-1 font-semibold">
          {{ titles[key] }}
        </div>

        <div class="text-sm">
          <template v-if="menuItems.length">
            <ClientOnly>
              <NuxtLink
                v-for="item in menuItems"
                :key="item.id"
                :to="item.url"
                class="py-1.5 block hover:underline"
              >
                {{ item.label }}
              </NuxtLink>
              <template #fallback>
                <a
                  v-for="item in menuItems"
                  :key="item.id"
                  :href="item.url"
                  class="py-1.5 block hover:underline"
                >
                  {{ item.label }}
                </a>
              </template>
            </ClientOnly>
          </template>
          <div v-else class="text-gray-400 text-xs italic">Nog geen items</div>
        </div>
      </div>
    </div>

    <!-- 🔸 Onderbalk -->
    <div class="container border-t flex items-center justify-center mb-4">
      <!-- Eventuele versie-info behouden -->
      <!--
      <div class="copywrite">
        <p class="py-4 text-xs text-center">
          <a
            href="https://woonuxt.com"
            :title="`WooNuxt v${wooNuxtVersionInfo}`"
          >
            {{ `WooNuxt v${wooNuxtVersionInfo}` }}
          </a>
        </p>
      </div>
      -->
      <SocialIcons class="ml-auto" />
    </div>
  </footer>
</template>

<style scoped lang="postcss">
a {
  @apply hover:underline;
}
</style>

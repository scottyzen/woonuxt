<script setup lang="ts">
import type { Product } from '~/types/product'

const { setProducts, updateProductList } = useProducts()
const { isQueryEmpty } = useHelpers()
const { storeSettings } = useAppConfig()
const route = useRoute()
const slug = route.params.categorySlug as string

// 🔹 Ophalen producten + categorie via de standaard Woonuxt query
const { data, pending, error } = await useAsyncGql('getProducts', { slug })

const productsInCategory = computed(
  () => (data.value?.products?.nodes || []) as Product[]
)
const category = computed(() => data.value?.productCategories?.nodes?.[0])

// 🔹 Products in de store zetten
setProducts(productsInCategory.value)

// 🔹 Filters opnieuw laden bij query-verandering
onMounted(() => {
  if (!isQueryEmpty.value) updateProductList()
})

watch(
  () => route.query,
  () => {
    if (route.name !== '[categorySlug]') return
    updateProductList()
  }
)

// 🔹 SEO metadata
useHead(() => ({
  title: category.value?.name || 'Categorie',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content:
        category.value?.description
          ?.replace(/<[^>]+>/g, '')
          .substring(0, 155) || '',
    },
  ],
}))
</script>

<template>
  <div class="container">
    <!-- Loader -->
    <div v-if="pending" class="flex justify-center items-center min-h-[50vh]">
      <Loader />
    </div>

    <!-- Foutmelding -->
    <div v-else-if="error" class="text-center text-red-600 p-8">
      Er is een fout opgetreden bij het laden van deze categorie.
    </div>

    <!-- Categorie content -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-16 mt-8"
    >
      <!-- Sidebar -->
      <aside class="order-2 md:order-1">
        <CategorySidebarWidget class="mt-8 pt-6 border-t border-gray-100" />
        <Filters v-if="storeSettings.showFilters" :hide-categories="true" />
      </aside>

      <!-- Main content -->
      <section class="order-1 md:order-2 w-full">
        <!-- Breadcrumb -->
        <nav class="text-sm text-gray-500 mb-2">
          <NuxtLink to="/" class="hover:underline">Home</NuxtLink>

          <!-- Dynamische ancestors -->
          <template v-for="ancestor in category?.ancestors?.nodes" :key="ancestor.id">
            <span class="mx-2">/</span>
            <NuxtLink
              :to="`/${ancestor.slug}`"
              class="hover:underline capitalize"
            >
              {{ ancestor.name }}
            </NuxtLink>
          </template>

          <span class="mx-2">/</span>
          <span class="text-gray-700 font-medium">{{ category?.name }}</span>
        </nav>

        <!-- Titel -->
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">
          {{ category?.name }}
        </h1>

        <!-- Beschrijving -->
        <div
          v-if="category?.description"
          v-html="category.description"
          class="text-sm text-gray-700 leading-relaxed mb-6"
        />

        <!-- Controls (sorteren, filters, etc.) -->
        <div
          class="flex items-center justify-between w-full gap-4 mb-6 md:gap-8"
        >
          <ProductResultCount />
          <OrderByDropdown
            v-if="storeSettings.showOrderByDropdown"
            class="hidden md:inline-flex"
          />
          <ShowFilterTrigger
            v-if="storeSettings.showFilters"
            class="md:hidden"
          />
        </div>

        <!-- Producten -->
        <ProductGrid />
      </section>
    </div>
  </div>
</template>

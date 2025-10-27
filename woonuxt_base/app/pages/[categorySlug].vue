<script setup lang="ts">
import { useProducts } from '~/composables/useProducts'
import { useHelpers } from '~/composables/useHelpers'
import { useAppConfig } from '#imports'

  import getCategoryBySlug from '~/woonuxt_base/app/queries/getCategoryBySlug.gql'
import Filters from '~/components/filters/Filters.vue'
import ProductGrid from '~/components/productElements/ProductGrid.vue'
import ProductResultCount from '~/components/productElements/ProductResultCount.vue'
import OrderByDropdown from '~/components/productElements/OrderByDropdown.vue'
import ShowFilterTrigger from '~/components/filters/ShowFilterTrigger.vue'

const { setProducts, updateProductList } = useProducts()
const { isQueryEmpty } = useHelpers()
const { storeSettings } = useAppConfig()
const route = useRoute()
const slug = route.params.categorySlug as string

// 🧩 GraphQL categorie + producten ophalen
const { data } = await useAsyncGql('getCategoryBySlug', { slug })
const category = computed(() => data.value?.productCategory)
const productsInCategory = computed(() => category.value?.products?.nodes || [])


// 🧠 Products beschikbaar maken in globale Woonuxt state
setProducts(productsInCategory.value)

// 🔁 Filters reageren op queryveranderingen
onMounted(() => {
  if (!isQueryEmpty.value) updateProductList()
})

watch(
  () => route.query,
  () => {
    updateProductList()
  }
)

// 🧭 SEO meta
useHead({
  title: category.value?.name
    ? `${category.value.name} | Kledingzoeken.nl`
    : 'Categorie | Kledingzoeken.nl',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content:
        category.value?.description?.replace(/<[^>]+>/g, '').substring(0, 155) ||
        `Bekijk de nieuwste producten in de categorie ${category.value?.name}.`,
    },
  ],
})
</script>

<template>
  <div class="container">
    <div class="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-16 mt-8">
      <!-- Sidebar -->
      <aside class="order-2 md:order-1">
        <Filters v-if="storeSettings.showFilters" :hide-categories="true" />
      </aside>

      <!-- Main Content -->
      <section class="order-1 md:order-2 w-full">
        <!-- Breadcrumb -->
        <nav class="text-sm text-gray-500 mb-2">
          <NuxtLink to="/" class="hover:underline">Home</NuxtLink>
          <template v-for="(ancestor, index) in category?.ancestors?.nodes" :key="ancestor.id">
            <span class="mx-2">/</span>
            <NuxtLink :to="`/${ancestor.slug}`" class="hover:underline">
              {{ ancestor.name }}
            </NuxtLink>
          </template>
          <span class="mx-2">/</span>
          <span class="text-gray-700 font-medium">{{ category?.name }}</span>
        </nav>

        <!-- Title -->
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">
          {{ category?.name || 'Categorie laden...' }}
        </h1>

        <!-- Description -->
        <div
          v-if="category?.description"
          class="text-sm text-gray-700 leading-relaxed mb-6"
          v-html="category.description"
        />

        <!-- Controls -->
        <div class="flex items-center justify-between w-full gap-4 mb-6 md:gap-8">
          <ProductResultCount />
          <OrderByDropdown
            class="hidden md:inline-flex"
            v-if="storeSettings.showOrderByDropdown"
          />
          <ShowFilterTrigger
            v-if="storeSettings.showFilters"
            class="md:hidden"
          />
        </div>

        <!-- Product Grid -->
        <div v-if="error" class="text-red-500 text-center my-10">
          Er is een fout opgetreden bij het laden van de categorie.
        </div>
        <ProductGrid v-else />
      </section>
    </div>
  </div>
</template>

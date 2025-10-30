<script setup lang="ts">
import type { Product } from '~/types/product'

// ✅ Nieuwe gedeelde listing composable
const { allProducts, hasProducts, storeSettings } = useProductListing()
const route = useRoute()

// ✅ Dynamische categorie info uit de GraphQL response
const category = computed(() => allProducts.value?.[0]?.productCategories?.nodes?.find(
  (cat) => cat.slug === route.params.categorySlug
))

// ✅ SEO metadata
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
    <div
      v-if="hasProducts"
      class="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-16 mt-8"
    >
      <!-- Sidebar -->
      <aside class="order-2 md:order-1">
        <!-- ✅ Filters hergebruikt van /products, maar categorie verbergen -->
        <Filters v-if="storeSettings.showFilters" :hide-categories="true" />
      </aside>

      <!-- Main content -->
      <section class="order-1 md:order-2 w-full">
        <!-- Breadcrumb -->
        <nav class="text-sm text-gray-500 mb-2">
          <NuxtLink to="/" class="hover:underline">Home</NuxtLink>

          <span class="mx-2">/</span>
          <span class="text-gray-700 font-medium capitalize">
            {{ category?.name || route.params.categorySlug }}
          </span>
        </nav>

        <!-- Titel -->
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">
          {{ category?.name || route.params.categorySlug }}
        </h1>

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

    <!-- Geen producten -->
    <NoProductsFound v-else>
      Geen producten gevonden in deze categorie. Pas je filters aan om meer producten te vinden.
    </NoProductsFound>
  </div>
</template>

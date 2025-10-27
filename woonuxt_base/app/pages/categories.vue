<script setup lang="ts">
import { ref, computed } from 'vue'

// 🔹 1. Haal ALLE categorieën op (met parent info)
const { data } = await useAsyncGql('getProductCategories')
const allCategories = (data.value?.productCategories?.nodes as ProductCategory[]) || []

// 🔹 2. Definieer hoofdcategorieën (de tab-buttons)
const mainCategoryIds = [34, 35, 36, 37, 38]
const mainCategories = computed(() =>
  allCategories.filter(cat => mainCategoryIds.includes(cat.databaseId))
)

// 🔹 3. Actieve tab state
const activeCategoryId = ref(mainCategoryIds[0])

// 🔹 4. Subcategorieën van actieve tab (alleen eerste level)
const subCategories = computed(() =>
  allCategories.filter(cat => cat.parentDatabaseId === activeCategoryId.value)
)

// 🔹 5. SEO en meta
useHead({
  title: `Categorieën`,
  meta: [{ name: 'description', content: 'Bekijk alle kledingcategorieën' }],
  link: [{ rel: 'canonical', href: 'https://jouwdomein.nl/categories' }],
})
</script>

<template>
  <main class="container py-6">
    <!-- Tabs -->
    <div class="flex flex-wrap gap-3 mb-6 border-b border-gray-200 pb-2">
      <button
        v-for="cat in mainCategories"
        :key="cat.id"
        @click="activeCategoryId = cat.databaseId"
        class="px-4 py-2 rounded-t-lg font-medium transition-all"
        :class="activeCategoryId === cat.databaseId ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Subcategorieën -->
    <div v-if="subCategories.length" class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
      <CategoryCard
        v-for="(subcat, i) in subCategories"
        :key="subcat.id"
        :node="subcat"
        :image-loading="i <= 2 ? 'eager' : 'lazy'"
      />
    </div>

    <div v-else class="my-10 text-center text-gray-500">
      Geen subcategorieën gevonden voor deze categorie.
    </div>
  </main>
</template>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style>

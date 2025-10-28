<script setup lang="ts">
import type { ProductCategory } from '~/types/product'

// 🔹 De hoofdcategorieën (ID’s van 34 t/m 38)
const includeIds = [34, 35, 36, 37, 38]

// 🔹 Haal alle hoofdcategorieën op
const { data, pending, error } = await useAsyncGql('getProductCategories', { include: includeIds })
const categories = computed(() => data.value?.productCategories?.nodes || [])

// 🔹 Actieve tab (eerste categorie standaard)
const activeCategoryId = ref(includeIds[0])

// 🔹 Haal de subcategorieën op van de actieve categorie
const { data: subData, refresh: refreshSub } = await useAsyncGql('getProductCategories', {
  first: 50,
})
const allCategories = computed(() => subData.value?.productCategories?.nodes || [])

// 🔹 Filter alleen de subcategorieën van de actieve categorie
const subCategories = computed(() =>
  allCategories.value.filter(cat => cat.parentDatabaseId === activeCategoryId.value)
)

// 🔹 Wanneer tab verandert → refresh query
watch(activeCategoryId, async () => {
  await refreshSub()
})

// 🔹 Meta / SEO
useHead({
  title: 'Categorieën',
  meta: [{ name: 'description', content: 'Bekijk alle productcategorieën' }],
})
</script>

<template>
  <main class="container py-8">
    <!-- 🧭 Tabs -->
    <div class="flex justify-center gap-2 md:gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
      <button
        v-for="catId in includeIds"
        :key="catId"
        @click="activeCategoryId = catId"
        class="px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200"
        :class="{
          'border-primary text-primary': activeCategoryId === catId,
          'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300': activeCategoryId !== catId,
        }"
      >
        {{ categories.find(c => c.databaseId === catId)?.name || '...' }}
      </button>
    </div>

    <!-- 🌀 Loader -->
    <div v-if="pending" class="flex justify-center items-center min-h-[40vh]">
      <div class="animate-spin h-8 w-8 border-t-2 border-primary rounded-full" />
    </div>

    <!-- ⚠️ Foutmelding -->
    <div v-else-if="error" class="text-center text-red-600 p-6">
      Er is een fout opgetreden bij het laden van categorieën.
    </div>

    <!-- 🧩 Subcategorieën -->
    <div v-else>
      <div
        v-if="subCategories.length"
        class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        <CategoryCard
          v-for="(category, i) in subCategories"
          :key="category.id"
          :node="category"
          :image-loading="i <= 2 ? 'eager' : 'lazy'"
        />
      </div>

      <div v-else class="text-center text-gray-500 py-12">
        Geen subcategorieën gevonden voor deze categorie.
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import CategoryCard from '~/components/CategoryCard.vue'

// 🔹 Bepaal de hoofdcategorieën die als tabs moeten worden weergegeven
const topCategoryIds = [34, 35, 36, 37, 38]

// Haal de hoofdcategorieën op
const { data: parentData } = await useAsyncGql('getProductCategories', { include: topCategoryIds })
const parentCategories = computed(() => parentData.value?.productCategories?.nodes || [])

// Actieve tab (eerste categorie standaard)
const activeCategory = ref(parentCategories.value?.[0] || null)

// Haal alle categorieën op (nodig om subcategorieën te filteren)
const { data: allData, refresh } = await useAsyncGql('getProductCategories', { first: 100 })
const allCategories = computed(() => allData.value?.productCategories?.nodes || [])

// Filter alleen subcategorieën van de actieve categorie (één level diep)
const subCategories = computed(() =>
  allCategories.value.filter(cat => cat.parentDatabaseId === activeCategory.value?.databaseId)
)

// Toon loader bij het laden of wisselen van categorie
const isLoading = ref(false)

async function selectCategory(cat) {
  if (cat.databaseId === activeCategory.value?.databaseId) return
  isLoading.value = true
  activeCategory.value = cat
  // Simuleer lichte vertraging voor fade effect (zoals WooNuxt loaders doen)
  await new Promise(r => setTimeout(r, 250))
  isLoading.value = false
}

// SEO meta
useHead({
  title: 'Categorieën',
  meta: [{ name: 'description', content: 'Ontdek alle kledingcategorieën van KledingZoeken.' }],
})
</script>

<template>
  <main class="container py-8">
    <!-- 🧭 Tabs gecentreerd bovenaan -->
    <div class="flex justify-center mb-8 border-b border-gray-200">
      <div class="flex gap-6 flex-wrap justify-center">
        <button
          v-for="cat in parentCategories"
          :key="cat.id"
          class="pb-2 text-base font-medium border-b-2 transition-colors duration-200"
          :class="{
            'border-primary text-primary': activeCategory?.databaseId === cat.databaseId,
            'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300': activeCategory?.databaseId !== cat.databaseId
          }"
          @click="selectCategory(cat)"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- 🌀 Loader (in WooNuxt-stijl) -->
    <div v-if="!parentCategories.length || isLoading" class="flex justify-center items-center min-h-[40vh]">
      <LoadingIcon class="m-auto" />
    </div>

    <!-- 🧩 Subcategorieën grid met fade animatie -->
    <Transition name="fade" mode="out-in">
      <div
        v-if="subCategories.length && !isLoading"
        key="subcats"
        class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        <CategoryCard
          v-for="(subcategory, i) in subCategories"
          :key="subcategory.id"
          :node="subcategory"
          :image-loading="i <= 2 ? 'eager' : 'lazy'"
        />
      </div>

      <div
        v-else-if="!isLoading && activeCategory"
        key="empty"
        class="text-center text-gray-500 py-12"
      >
        Geen subcategorieën gevonden voor <strong>{{ activeCategory?.name }}</strong>.
      </div>
    </Transition>
  </main>
</template>

<style scoped>
/* Fade-animatie in WooNuxt-stijl */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

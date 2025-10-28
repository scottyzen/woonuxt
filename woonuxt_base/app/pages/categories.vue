<script setup lang="ts">
import CategoryCard from '~/components/CategoryCard.vue'

// 👶 Gewenste volgorde van hoofdcategorieën
const topCategoryIds = [38, 37, 36, 35, 34] 
// Baby’s, Meisjes, Jongens, Heren, Dames (omgekeerde volgorde)

const { data: parentData } = await useAsyncGql('getProductCategories', { include: topCategoryIds })
const parentCategories = computed(() =>
  parentData.value?.productCategories?.nodes?.sort(
    (a, b) => topCategoryIds.indexOf(a.databaseId) - topCategoryIds.indexOf(b.databaseId)
  ) || []
)

// Actieve tab
const activeCategory = ref(parentCategories.value?.[0] || null)

// Haal ALLE categorieën op
const { data: allData } = await useAsyncGql('getProductCategories', { first: 200 })
const allCategories = computed(() => allData.value?.productCategories?.nodes || [])

// Vind eerste-level subcategorieën van de actieve categorie
const firstLevelSubs = computed(() =>
  allCategories.value.filter(cat => cat.parentDatabaseId === activeCategory.value?.databaseId)
)

// Vind tweede-level subcategorieën (kinderen van de eerste-level subcategorieën)
const secondLevelSubs = computed(() => {
  const subs = {}
  firstLevelSubs.value.forEach(sub => {
    subs[sub.databaseId] = allCategories.value.filter(c => c.parentDatabaseId === sub.databaseId)
  })
  return subs
})

// Loader voor animatie bij tabwissel
const isLoading = ref(false)

async function selectCategory(cat) {
  if (cat.databaseId === activeCategory.value?.databaseId) return
  isLoading.value = true
  activeCategory.value = cat
  await new Promise(r => setTimeout(r, 250))
  isLoading.value = false
}

// SEO
useHead({
  title: 'Categorieën',
  meta: [{ name: 'description', content: 'Ontdek alle kledingcategorieën van KledingZoeken.' }],
})
</script>

<template>
  <main class="container py-8">
    <!-- Tabs -->
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

    <!-- Loader -->
    <div v-if="isLoading || !parentCategories.length" class="flex justify-center items-center min-h-[40vh]">
      <LoadingIcon class="m-auto" />
    </div>

    <!-- Fade animatie -->
    <Transition name="fade" mode="out-in">
      <div v-if="!isLoading" key="subcats" class="space-y-12">
        <div
          v-for="(subLevelCats, parentId) in secondLevelSubs"
          :key="parentId"
          class="space-y-6"
        >
          <!-- Titel van eerste-level subcategorie -->
          <h2 class="text-xl font-semibold border-b pb-2">
            {{ firstLevelSubs.find(cat => cat.databaseId === Number(parentId))?.name }}
          </h2>

          <!-- Tweede-level subcategorieën -->
          <div
            v-if="subLevelCats.length"
            class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            <CategoryCard
              v-for="(subcategory, i) in subLevelCats"
              :key="subcategory.id"
              :node="subcategory"
              :image-loading="i <= 2 ? 'eager' : 'lazy'"
            />
          </div>

          <div v-else class="text-gray-400 text-sm">Geen subcategorieën gevonden.</div>
        </div>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

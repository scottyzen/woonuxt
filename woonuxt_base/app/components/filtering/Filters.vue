<script setup lang="ts">
import { TaxonomyEnum } from '#woo'

const { isFiltersActive } = useFiltering()
const { removeBodyClass } = useHelpers()
const runtimeConfig = useRuntimeConfig()
const { storeSettings } = useAppConfig()
const route = useRoute()

const { hideCategories } = defineProps({
  hideCategories: { type: Boolean, default: false },
})
const currentSlug = route.params.categorySlug as string

// 🧩 Attributenfilters
const globalProductAttributes =
  (runtimeConfig?.public?.GLOBAL_PRODUCT_ATTRIBUTES as WooNuxtFilter[]) || []
const taxonomies = globalProductAttributes.map((attr) =>
  attr?.slug?.toUpperCase().replace(/_/g, '')
) as TaxonomyEnum[]

// 🎯 Huidige categorie ophalen
const { data: categoryData } = await useAsyncGql('getCategoryTreeBySlug', { slug: currentSlug })
const category = computed(() => categoryData.value?.productCategory)

// ✅ Ancestors in juiste volgorde: root → parent → current
const orderedAncestors = computed(() => {
  const list = category.value?.ancestors?.nodes || []
  return [...list].reverse()
})

// 🧭 Rootcategorie
const rootCategory = computed(() => {
  return orderedAncestors.value.length
    ? orderedAncestors.value[0]
    : category.value
})

// 📂 Subcategorieën
const subCategories = computed(() => category.value?.children?.nodes || [])

// 🔙 Parentcategorie
const parentCategory = computed(() => category.value?.parent?.node)

// 🎨 Attributenfilters
const { data: termData } = await useAsyncGql('getAllTerms', {
  taxonomies: [...taxonomies, TaxonomyEnum.PRODUCTCATEGORY],
})
const terms = termData.value?.terms?.nodes || []
const attributesWithTerms = globalProductAttributes.map((attr) => ({
  ...attr,
  terms: terms.filter((term) => term.taxonomyName === attr.slug),
}))
</script>

<template>
  <!-- 🧭 Dynamische categorieboom -->
  <div v-if="!hideCategories && category" class="pt-4">
    <h3 class="font-semibold text-gray-900 mb-3">
      Categorieën<span v-if="rootCategory"> — {{ rootCategory.name }}</span>
    </h3>

    <div v-if="parentCategory" class="mb-3">
      <NuxtLink
        :to="`/${parentCategory.slug}`"
        class="text-sm text-gray-500 hover:text-primary transition"
      >
        ← Terug naar {{ parentCategory.name }}
      </NuxtLink>
    </div>

    <ul class="space-y-1">
      <!-- ✅ Gebruik de correct geordende ancestors -->
      <li
        v-for="(anc, index) in orderedAncestors"
        :key="anc.id"
        :style="{ marginLeft: `${index * 10}px` }"
      >
        <NuxtLink
          :to="`/${anc.slug}`"
          class="block font-medium text-gray-700 hover:text-primary transition"
        >
          {{ anc.name }}
        </NuxtLink>
      </li>

      <!-- Huidige categorie -->
      <li
        :style="{
          marginLeft: `${(orderedAncestors?.length || 0) * 10}px`,
        }"
      >
        <span class="block font-semibold text-gray-900">
          {{ category.name }}
        </span>

        <ul
          v-if="subCategories?.length"
          class="space-y-1 mt-1 border-l border-gray-200 pl-3"
        >
          <li v-for="sub in subCategories" :key="sub.id">
            <NuxtLink
              :to="`/${sub.slug}`"
              class="block text-gray-700 hover:text-primary transition"
              :class="{ 'underline text-primary font-medium': sub.slug === currentSlug }"
            >
              {{ sub.name }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

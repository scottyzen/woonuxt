<script setup lang="ts">
import { TaxonomyEnum } from '#woo'

const { isFiltersActive } = useFiltering()
const { removeBodyClass } = useHelpers()
const runtimeConfig = useRuntimeConfig()
const { storeSettings } = useAppConfig()
const route = useRoute()

const { hideCategories } = defineProps({ hideCategories: { type: Boolean, default: false } })
const currentSlug = route.params.categorySlug as string

// 🧩 Attributenfilters blijven hetzelfde
const globalProductAttributes =
  (runtimeConfig?.public?.GLOBAL_PRODUCT_ATTRIBUTES as WooNuxtFilter[]) || []
const taxonomies = globalProductAttributes.map((attr) =>
  attr?.slug?.toUpperCase().replace(/_/g, '')
) as TaxonomyEnum[]

// 🎯 Huidige categorie ophalen met hiërarchie
const { data: categoryData } = await useAsyncGql('getCategoryTreeBySlug', { slug: currentSlug })
const category = computed(() => categoryData.value?.productCategory)

// 🧭 Rootcategorie = hoogste ancestor (of zichzelf)
const rootCategory = computed(() => {
  const ancestors = category.value?.ancestors?.nodes || []
  return ancestors.length ? ancestors[ancestors.length - 1] : category.value
})

// 📂 Subcategorieën = directe kinderen
const subCategories = computed(() => category.value?.children?.nodes || [])

// 🔙 Parentcategorie = directe parent
const parentCategory = computed(() => category.value?.parent)

// 🎨 Attributenfilters via getAllTerms (blijft werken)
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
  <aside id="filters">
    <OrderByDropdown class="block w-full md:hidden" />

    <div class="relative z-30 grid mb-12 space-y-8 divide-y">
      <!-- 📂 Dynamische categorieën -->
      <div v-if="!hideCategories && category" class="pt-4">
        <h3 class="font-semibold text-gray-900 mb-3">
          Categorieën
          <span v-if="rootCategory"> — {{ rootCategory.name }}</span>
        </h3>

        <!-- 🔙 Terug naar parent -->
        <div v-if="parentCategory" class="mb-3">
          <NuxtLink
            :to="`/${parentCategory.slug}`"
            class="text-sm text-gray-500 hover:text-primary-600 transition"
          >
            ← Terug naar {{ parentCategory.name }}
          </NuxtLink>
        </div>

        <!-- 🌿 Subcategorieën van huidige categorie -->
        <ul v-if="subCategories?.length" class="space-y-1 ml-1 border-l border-gray-200 pl-3">
          <li v-for="sub in subCategories" :key="sub.id">
            <NuxtLink
              :to="`/${sub.slug}`"
              class="block text-gray-700 hover:text-primary-600 transition"
              :class="{ 'underline text-primary-600 font-medium': sub.slug === currentSlug }"
            >
              {{ sub.name }}
            </NuxtLink>
          </li>
        </ul>

        <!-- 🧭 Anders toon de children van rootcategorie -->
        <ul v-else-if="rootCategory?.children?.nodes?.length" class="space-y-1 ml-1 border-l border-gray-200 pl-3">
          <li v-for="child in rootCategory.children.nodes" :key="child.id">
            <NuxtLink
              :to="`/${child.slug}`"
              class="block text-gray-700 hover:text-primary-600 transition"
              :class="{ 'underline text-primary-600 font-medium': child.slug === currentSlug }"
            >
              {{ child.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <PriceFilter />

      <div v-for="attribute in attributesWithTerms" :key="attribute.slug">
        <ColorFilter
          v-if="attribute.slug == 'pa_color' || attribute.slug == 'pa_colour'"
          :attribute
        />
        <GlobalFilter v-else :attribute />
      </div>

      <OnSaleFilter />
      <LazyStarRatingFilter v-if="storeSettings.showReviews" />
      <LazyResetFiltersButton v-if="isFiltersActive" />
    </div>
  </aside>

  <div
    class="fixed inset-0 z-50 hidden bg-black opacity-25 filter-overlay"
    @click="removeBodyClass('show-filters')"
  ></div>
</template>

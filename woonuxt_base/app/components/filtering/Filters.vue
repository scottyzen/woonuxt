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

// 🔙 Parentcategorie = directe parent (nu via node)
const parentCategory = computed(() => category.value?.parent?.node)

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
      <!-- 📂 Dynamische categorieboom -->
      <div v-if="!hideCategories && category" class="pt-4">
        <h3 class="font-semibold text-gray-900 mb-3">
          Categorieën<span v-if="rootCategory"> — {{ rootCategory.name }}</span>
        </h3>

        <!-- 🔙 Link naar bovenliggende categorie -->
        <div v-if="parentCategory" class="mb-3">
          <NuxtLink
            :to="`/${parentCategory.slug}`"
            class="text-sm text-gray-500 hover:text-primary-600 transition"
          >
            ← Terug naar {{ parentCategory.name }}
          </NuxtLink>
        </div>

        <!-- 🌿 Toon hiërarchie van root → ancestors → huidige categorie → subcategorieën -->
        <ul class="space-y-1">
          <!-- Root en ancestors -->
          <li
            v-for="(anc, index) in category.ancestors?.nodes"
            :key="anc.id"
            :style="{ marginLeft: `${index * 10}px` }"
          >
            <NuxtLink
              :to="`/${anc.slug}`"
              class="block font-medium text-gray-700 hover:text-primary-600 transition"
            >
              {{ anc.name }}
            </NuxtLink>
          </li>

          <!-- Huidige categorie -->
          <li
            :style="{
              marginLeft: `${(category.ancestors?.nodes?.length || 0) * 10}px`,
            }"
          >
            <span class="block font-semibold text-gray-900">
              {{ category.name }}
            </span>

            <!-- Subcategorieën -->
            <ul
              v-if="subCategories?.length"
              class="space-y-1 mt-1 border-l border-gray-200 pl-3"
            >
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
          </li>
        </ul>
      </div>

      <!-- 💰 Prijsfilter -->
      <PriceFilter />

      <!-- 🎨 Attributenfilters -->
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

  <!-- Overlay -->
  <div
    class="fixed inset-0 z-50 hidden bg-black opacity-25 filter-overlay"
    @click="removeBodyClass('show-filters')"
  ></div>
</template>

<style scoped lang="postcss">
#filters {
  @apply w-[280px];
}
ul {
  @apply list-none pl-0;
}
ul ul {
  @apply ml-4 border-l border-gray-100 pl-3;
}
a {
  @apply text-base text-gray-700;
}
a.underline {
  text-decoration-thickness: 1.5px;
  text-underline-offset: 2px;
}
a:hover {
  @apply text-primary-600;
}
span.font-semibold {
  @apply text-base;
}
.show-filters .filter-overlay {
  @apply block;
}
.show-filters {
  overflow: hidden;
}
</style>

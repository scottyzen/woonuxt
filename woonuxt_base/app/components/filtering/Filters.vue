<script setup lang="ts">
import { TaxonomyEnum } from '#woo'

const { isFiltersActive } = useFiltering()
const { removeBodyClass } = useHelpers()
const runtimeConfig = useRuntimeConfig()
const { storeSettings } = useAppConfig()
const route = useRoute()

// hide-categories prop is used to hide the category filter on the product category page
const { hideCategories } = defineProps({ hideCategories: { type: Boolean, default: false } })

const currentSlug = route.params.categorySlug as string

// 🔹 Globale WooNuxt attributen (kleur, maat, etc.)
const globalProductAttributes =
  (runtimeConfig?.public?.GLOBAL_PRODUCT_ATTRIBUTES as WooNuxtFilter[]) || []
const taxonomies = globalProductAttributes.map((attr) =>
  attr?.slug?.toUpperCase().replace(/_/g, '')
) as TaxonomyEnum[]

// 🔹 Ophalen van alle termen inclusief categorieën
const { data } = await useAsyncGql('getAllTerms', {
  taxonomies: [...taxonomies, TaxonomyEnum.PRODUCTCATEGORY],
})
const terms = data.value?.terms?.nodes || []

// 🔹 Alle productcategorieën ophalen
const productCategoryTerms = terms.filter((t) => t.taxonomyName === 'product_cat')

// ✅ Veilige functie om boom te bouwen (voorkomt recursielus)
function buildTree(terms: any[], parentId: number | null = null, visited = new Set()) {
  if (!Array.isArray(terms)) return []
  return terms
    .filter((t) => {
      if (!t.parentId && parentId === null) return true
      return t.parentId === parentId
    })
    .map((term) => {
      if (visited.has(term.databaseId)) return term
      visited.add(term.databaseId)
      const children = buildTree(terms, term.databaseId, visited)
      return { ...term, children }
    })
}

const categoryTree = computed(() => buildTree(productCategoryTerms))

// 🔹 Huidige categorie ophalen
const currentCategory = computed(() =>
  productCategoryTerms.find((t) => t.slug === currentSlug)
)

// 🔹 Parentcategorie (voor navigatie omhoog)
const parentCategory = computed(() => {
  if (!currentCategory.value?.parentId) return null
  return productCategoryTerms.find(
    (t) => t.databaseId === currentCategory.value?.parentId
  )
})

// 🔹 Directe subcategorieën van de huidige categorie
const subCategories = computed(() => {
  if (!currentCategory.value) return []
  const currentId = currentCategory.value.databaseId
  return productCategoryTerms.filter((t) => t.parentId === currentId)
})

// 🔹 Filter attributen (kleur, maat, etc.)
const attributesWithTerms = globalProductAttributes.map((attr) => ({
  ...attr,
  terms: terms.filter((term) => term.taxonomyName === attr.slug),
}))
</script>

<template>
  <aside id="filters">
    <OrderByDropdown class="block w-full md:hidden" />

    <div class="relative z-30 grid mb-12 space-y-8 divide-y">

      <!-- 📂 Categorieën -->
      <div v-if="!hideCategories" class="pt-4">
        <h3 class="font-semibold text-gray-900 mb-3">Categorieën</h3>

        <!-- 🔝 Parentcategorie (navigatie omhoog) -->
        <div v-if="parentCategory" class="mb-2">
          <NuxtLink
            :to="`/${parentCategory.slug}`"
            class="block text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            ← Terug naar {{ parentCategory.name }}
          </NuxtLink>
        </div>

        <!-- 🔸 Huidige categorie -->
        <div v-if="currentCategory" class="mb-3">
          <NuxtLink
            :to="`/${currentCategory.slug}`"
            class="block font-medium text-primary-600 underline decoration-2"
          >
            {{ currentCategory.name }}
          </NuxtLink>
        </div>

        <!-- 🔹 Subcategorieën -->
        <ul v-if="subCategories?.length" class="space-y-2 ml-2 border-l border-gray-200 pl-3">
          <li v-for="sub in subCategories" :key="sub.id">
            <NuxtLink
              :to="`/${sub.slug}`"
              class="block text-gray-700 hover:text-primary-600 transition-colors"
              :class="{ 'underline text-primary-600 font-medium': sub.slug === currentSlug }"
            >
              {{ sub.name }}
            </NuxtLink>
          </li>
        </ul>

        <!-- 🔸 Als er geen subcategorieën zijn, toon top-level -->
        <ul v-else class="space-y-2">
          <li v-for="cat in categoryTree" :key="cat.id">
            <NuxtLink
              :to="`/${cat.slug}`"
              class="block text-gray-700 hover:text-primary-600 transition-colors"
              :class="{ 'underline text-primary-600 font-medium': cat.slug === currentSlug }"
            >
              {{ cat.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- 💰 Prijsfilter -->
      <PriceFilter />

      <!-- 🎨 Overige filters -->
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

<style scoped lang="postcss">
.show-filters .filter-overlay {
  @apply block;
}
.show-filters {
  overflow: hidden;
}

#filters {
  @apply w-[280px];

  & .slider-connect {
    @apply bg-primary;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

/* 🔹 UX: betere hiërarchie */
ul {
  @apply list-none pl-0;
}

ul ul {
  @apply ml-4 border-l border-gray-100 pl-3;
}

a.underline {
  text-decoration-thickness: 1.5px;
  text-underline-offset: 2px;
}

.price-input {
  @apply border rounded-xl outline-none leading-tight w-full p-2 transition-all;

  &.active {
    @apply border-gray-400 pl-6;
  }
}

@media (max-width: 768px) {
  #filters {
    @apply bg-white h-full p-8 transform pl-2 transition-all ease-in-out bottom-0 left-4 -translate-x-[110vw] duration-300 overflow-auto fixed;

    box-shadow:
      -100px 0 0 white,
      -200px 0 0 white,
      -300px 0 0 white;
    z-index: 60;
  }

  .show-filters #filters {
    @apply transform-none;
  }
}
</style>

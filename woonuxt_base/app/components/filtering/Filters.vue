<script setup lang="ts">
import { TaxonomyEnum } from '#woo'

const { isFiltersActive } = useFiltering()
const { removeBodyClass } = useHelpers()
const runtimeConfig = useRuntimeConfig()
const { storeSettings } = useAppConfig()
const route = useRoute()

const { hideCategories } = defineProps({ hideCategories: { type: Boolean, default: false } })
const currentSlug = route.params.categorySlug as string

// 🧩 Globale attributen (kleur, maat, etc.)
const globalProductAttributes =
  (runtimeConfig?.public?.GLOBAL_PRODUCT_ATTRIBUTES as WooNuxtFilter[]) || []
const taxonomies = globalProductAttributes.map((attr) =>
  attr?.slug?.toUpperCase().replace(/_/g, '')
) as TaxonomyEnum[]

// 🧩 GraphQL data ophalen
const { data } = await useAsyncGql('getAllTerms', {
  taxonomies: [...taxonomies, TaxonomyEnum.PRODUCTCATEGORY],
})
const terms = data.value?.terms?.nodes || []
const productCategoryTerms = terms.filter((t) => t.taxonomyName === 'product_cat')

// 🧱 Safe tree builder met bescherming
function buildTree(terms, parentId = null, visited = new Set(), depth = 0) {
  if (!Array.isArray(terms) || depth > 20) return [] // hard limit
  return terms
    .filter((t) => (!t.parentId && parentId === null) || t.parentId === parentId)
    .map((term) => {
      if (visited.has(term.databaseId)) return term
      visited.add(term.databaseId)
      const children = buildTree(terms, term.databaseId, visited, depth + 1)
      return { ...term, children }
    })
}

const categoryTree = computed(() => buildTree(productCategoryTerms))

// 🧭 Vind huidige categorie
const currentCategory = computed(() =>
  productCategoryTerms.find((t) => t.slug === currentSlug)
)

// 🪜 Vind rootcategorie met veiligheidscheck
function findRootCategory(cat, depth = 0, visited = new Set()) {
  if (!cat || depth > 20 || visited.has(cat.databaseId)) return cat
  visited.add(cat.databaseId)
  const parent = productCategoryTerms.find((t) => t.databaseId === cat.parentId)
  if (!parent) return cat
  return findRootCategory(parent, depth + 1, visited)
}
const rootCategory = computed(() => findRootCategory(currentCategory.value))

// 🧭 Subtree (alleen categorieën binnen root)
function getSubtree(rootId, depth = 0, visited = new Set()) {
  if (!rootId || depth > 20) return []
  return productCategoryTerms
    .filter((t) => t.parentId === rootId)
    .map((term) => {
      if (visited.has(term.databaseId)) return term
      visited.add(term.databaseId)
      const children = getSubtree(term.databaseId, depth + 1, visited)
      return { ...term, children }
    })
}

const filteredTree = computed(() => {
  if (!rootCategory.value) return categoryTree.value
  return [
    {
      ...rootCategory.value,
      children: getSubtree(rootCategory.value.databaseId),
    },
  ]
})

// 🔙 Parentcategorie
const parentCategory = computed(() => {
  if (!currentCategory.value?.parentId) return null
  return productCategoryTerms.find(
    (t) => t.databaseId === currentCategory.value?.parentId
  )
})

// 📂 Directe subcategorieën
const subCategories = computed(() => {
  if (!currentCategory.value) return []
  return productCategoryTerms.filter(
    (t) => t.parentId === currentCategory.value.databaseId
  )
})

// 🎨 Attributenfilters
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
      <div v-if="!hideCategories && filteredTree?.length" class="pt-4">
        <h3 class="font-semibold text-gray-900 mb-3">
          Categorieën<span v-if="rootCategory"> — {{ rootCategory.name }}</span>
        </h3>

        <!-- 🔙 Link naar bovenliggende categorie -->
        <div v-if="parentCategory" class="mb-2">
          <NuxtLink
            :to="`/${parentCategory.slug}`"
            class="block text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            ← Terug naar {{ parentCategory.name }}
          </NuxtLink>
        </div>

        <!-- 🔹 Subcategorieën -->
        <ul
          v-if="subCategories?.length"
          class="space-y-2 ml-2 border-l border-gray-200 pl-3"
        >
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

        <!-- 🔸 Anders toon subtree van root -->
        <template v-else>
          <ul v-for="cat in filteredTree" :key="cat.id" class="space-y-2">
            <li>
              <NuxtLink
                :to="`/${cat.slug}`"
                class="block text-gray-800 font-medium hover:text-primary-600 transition-colors"
                :class="{ 'underline text-primary-600': cat.slug === currentSlug }"
              >
                {{ cat.name }}
              </NuxtLink>

              <ul
                v-if="cat.children?.length"
                class="mt-2 space-y-1 border-l border-gray-100 pl-3"
              >
                <li v-for="child in cat.children" :key="child.id">
                  <NuxtLink
                    :to="`/${child.slug}`"
                    class="block text-gray-700 hover:text-primary-600"
                    :class="{ 'underline text-primary-600': child.slug === currentSlug }"
                  >
                    {{ child.name }}
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </template>
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
a.underline {
  text-decoration-thickness: 1.5px;
  text-underline-offset: 2px;
}
.show-filters .filter-overlay {
  @apply block;
}
.show-filters {
  overflow: hidden;
}
</style>

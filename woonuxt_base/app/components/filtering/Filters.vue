<script setup lang="ts">
import { TaxonomyEnum } from '#woo'
import { ref, computed } from 'vue'
import { motion } from 'framer-motion'

// composables
const { isFiltersActive } = useFiltering()
const { removeBodyClass } = useHelpers()
const runtimeConfig = useRuntimeConfig()
const { storeSettings } = useAppConfig()
const route = useRoute()

// props
const { hideCategories } = defineProps({ hideCategories: { type: Boolean, default: false } })
const currentSlug = route.params.categorySlug as string

// 🧩 WooNuxt globale attributen (kleur, maat, etc.)
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

// ✅ veilige tree-builder (voorkomt recursielus)
function buildTree(terms, parentId = null, visited = new Set(), depth = 0) {
  if (!Array.isArray(terms) || depth > 20) return []
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

// 🧭 Huidige categorie
const currentCategory = computed(() =>
  productCategoryTerms.find((t) => t.slug === currentSlug)
)

// 🪜 Rootcategorie (zoals “Dames”)
function findRootCategory(cat, depth = 0, visited = new Set()) {
  if (!cat || depth > 20 || visited.has(cat.databaseId)) return cat
  visited.add(cat.databaseId)
  const parent = productCategoryTerms.find((t) => t.databaseId === cat.parentId)
  if (!parent) return cat
  return findRootCategory(parent, depth + 1, visited)
}
const rootCategory = computed(() => findRootCategory(currentCategory.value))

// 🌳 Subtree van de rootcategorie
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

// 🧭 Parent & subs
const parentCategory = computed(() => {
  if (!currentCategory.value?.parentId) return null
  return productCategoryTerms.find(
    (t) => t.databaseId === currentCategory.value?.parentId
  )
})

const subCategories = computed(() => {
  if (!currentCategory.value) return []
  return productCategoryTerms.filter(
    (t) => t.parentId === currentCategory.value.databaseId
  )
})

// 🎨 Filter attributen
const attributesWithTerms = globalProductAttributes.map((attr) => ({
  ...attr,
  terms: terms.filter((term) => term.taxonomyName === attr.slug),
}))

// 🧭 Accordeon state
const openIds = ref<Set<number>>(new Set())

function toggleCategory(id: number) {
  if (openIds.value.has(id)) {
    openIds.value.delete(id)
  } else {
    openIds.value.add(id)
  }
}
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

        <div v-if="parentCategory" class="mb-2">
          <NuxtLink
            :to="`/${parentCategory.slug}`"
            class="block text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            ← Terug naar {{ parentCategory.name }}
          </NuxtLink>
        </div>

        <!-- 🌲 Categorieboom -->
        <template v-for="cat in filteredTree" :key="cat.id">
          <CategoryAccordion
            :category="cat"
            :current-slug="currentSlug"
            :open-ids="openIds"
            @toggle="toggleCategory"
          />
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

<!-- ✅ Subcomponent voor accordeon -->
<script>
import { motion } from 'framer-motion'

export default {
  name: 'CategoryAccordion',
  props: {
    category: { type: Object, required: true },
    currentSlug: { type: String, required: true },
    openIds: { type: Object, required: true },
  },
  emits: ['toggle'],
  setup(props, { emit }) {
    const isOpen = computed(() => props.openIds.has(props.category.databaseId))
    const toggle = () => emit('toggle', props.category.databaseId)
    return { isOpen, toggle }
  },
  components: { motion },
  template: `
    <div class="category-item mb-1">
      <div
        class="flex items-center justify-between cursor-pointer select-none py-1"
        @click="toggle"
      >
        <NuxtLink
          :to="'/' + category.slug"
          class="text-gray-800 hover:text-primary-600 transition-colors"
          :class="{ 'font-medium underline text-primary-600': category.slug === currentSlug }"
        >
          {{ category.name }}
        </NuxtLink>

        <span
          v-if="category.children?.length"
          class="text-xs text-gray-400 ml-2"
        >
          <svg
            v-if="!isOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="w-3 h-3 inline-block"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="w-3 h-3 inline-block transform rotate-90 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>

      <motion.ul
        v-if="category.children?.length"
        :initial="{ height: 0, opacity: 0 }"
        :animate="isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }"
        transition="{ duration: 0.25 }"
        class="overflow-hidden border-l border-gray-100 ml-3 pl-3"
      >
        <li v-for="child in category.children" :key="child.id" class="py-0.5">
          <CategoryAccordion
            :category="child"
            :current-slug="currentSlug"
            :open-ids="openIds"
            @toggle="toggle"
          />
        </li>
      </motion.ul>
    </div>
  `,
}
</script>

<style scoped lang="postcss">
#filters {
  @apply w-[280px];
}
ul {
  @apply list-none pl-0;
}
.show-filters .filter-overlay {
  @apply block;
}
.show-filters {
  overflow: hidden;
}
</style>

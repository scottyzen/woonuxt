<script setup lang="ts">
import { TaxonomyEnum } from '#woo'
import { ref, computed, defineComponent } from 'vue'

const { isFiltersActive } = useFiltering()
const { removeBodyClass } = useHelpers()
const runtimeConfig = useRuntimeConfig()
const { storeSettings } = useAppConfig()
const route = useRoute()

const { hideCategories } = defineProps({ hideCategories: { type: Boolean, default: false } })
const currentSlug = route.params.categorySlug as string

// 🔹 WooNuxt attributen (kleur, maat, etc.)
const globalProductAttributes =
  (runtimeConfig?.public?.GLOBAL_PRODUCT_ATTRIBUTES as WooNuxtFilter[]) || []
const taxonomies = globalProductAttributes.map((attr) =>
  attr?.slug?.toUpperCase().replace(/_/g, '')
) as TaxonomyEnum[]

// 🔹 GraphQL data
const { data } = await useAsyncGql('getAllTerms', {
  taxonomies: [...taxonomies, TaxonomyEnum.PRODUCTCATEGORY],
})
const terms = data.value?.terms?.nodes || []
const productCategoryTerms = terms.filter((t) => t.taxonomyName === 'product_cat')

// 🔹 Boomstructuur veilig opbouwen
function buildTree(terms: any[], parentId: number | null = null, visited = new Set(), depth = 0) {
  if (!Array.isArray(terms) || depth > 15) return []
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
const currentCategory = computed(() => productCategoryTerms.find((t) => t.slug === currentSlug))

function findRootCategory(cat, depth = 0) {
  if (!cat || depth > 15) return cat
  const parent = productCategoryTerms.find((t) => t.databaseId === cat.parentId)
  return parent ? findRootCategory(parent, depth + 1) : cat
}

const rootCategory = computed(() => findRootCategory(currentCategory.value))
const filteredTree = computed(() => {
  if (!rootCategory.value) return categoryTree.value
  return [
    {
      ...rootCategory.value,
      children: productCategoryTerms.filter((t) => t.parentId === rootCategory.value.databaseId),
    },
  ]
})

const parentCategory = computed(() =>
  productCategoryTerms.find((t) => t.databaseId === currentCategory.value?.parentId)
)

const attributesWithTerms = globalProductAttributes.map((attr) => ({
  ...attr,
  terms: terms.filter((term) => term.taxonomyName === attr.slug),
}))

// 🔹 Accordeon open/dicht
const openIds = ref<Set<number>>(new Set())
function toggleCategory(id: number) {
  if (openIds.value.has(id)) openIds.value.delete(id)
  else openIds.value.add(id)
}

// 🔹 Subcomponent binnen setup
const CategoryAccordion = defineComponent({
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
  template: `
    <div class="category-item mb-1">
      <div class="flex items-center justify-between cursor-pointer py-1 select-none" @click="toggle">
        <NuxtLink
          :to="'/' + category.slug"
          class="text-gray-800 hover:text-primary-600"
          :class="{ 'font-medium underline text-primary-600': category.slug === currentSlug }"
        >
          {{ category.name }}
        </NuxtLink>
        <span v-if="category.children?.length" class="text-xs text-gray-400 ml-2">
          <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 inline-block transform rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>

      <!-- 🌿 Smooth animatie met transition -->
      <transition
        name="accordion"
        @enter="el => el.style.height = el.scrollHeight + 'px'"
        @after-enter="el => el.style.height = 'auto'"
        @leave="el => el.style.height = el.scrollHeight + 'px'"
        @after-leave="el => el.style.height = 0"
      >
        <ul v-show="isOpen" class="border-l border-gray-200 ml-3 pl-3 overflow-hidden">
          <li v-for="child in category.children" :key="child.id" class="py-0.5">
            <CategoryAccordion
              :category="child"
              :current-slug="currentSlug"
              :open-ids="openIds"
              @toggle="toggle"
            />
          </li>
        </ul>
      </transition>
    </div>
  `,
})
</script>

<template>
  <aside id="filters">
    <OrderByDropdown class="block w-full md:hidden" />

    <div class="relative z-30 grid mb-12 space-y-8 divide-y">
      <!-- 📂 Categorieën -->
      <div v-if="!hideCategories && filteredTree?.length" class="pt-4">
        <h3 class="font-semibold text-gray-900 mb-3">
          Categorieën <span v-if="rootCategory"> — {{ rootCategory.name }}</span>
        </h3>

        <div v-if="parentCategory" class="mb-2">
          <NuxtLink
            :to="`/${parentCategory.slug}`"
            class="block text-sm text-gray-500 hover:text-primary-600"
          >
            ← Terug naar {{ parentCategory.name }}
          </NuxtLink>
        </div>

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

<style scoped lang="postcss">
/* 🌿 Smooth height transition */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.25s ease-in-out;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  height: 0;
}

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

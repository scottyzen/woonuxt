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

// 🔹 Basisconfig (kleur, maat, prijs, etc.)
const globalProductAttributes =
  (runtimeConfig?.public?.GLOBAL_PRODUCT_ATTRIBUTES as WooNuxtFilter[]) || []
const taxonomies = globalProductAttributes.map((attr) =>
  attr?.slug?.toUpperCase().replace(/_/g, '')
) as TaxonomyEnum[]

const { data } = await useAsyncGql('getAllTerms', {
  taxonomies: [...taxonomies, TaxonomyEnum.PRODUCTCATEGORY],
})
const terms = data.value?.terms?.nodes

// 🔹 Alle productcategorieën ophalen
const productCategoryTerms = terms?.filter(
  (term) => term.taxonomyName === 'product_cat'
)

// 🔹 Hiërarchische categorieboom bouwen
function buildTree(terms: any[], parentId: number | null = null) {
  return terms
    ?.filter((t) => (t.parentId ? t.parentId === parentId : !t.parentId))
    ?.map((term) => ({
      ...term,
      children: buildTree(terms, term.databaseId),
    }))
}

const categoryTree = computed(() => buildTree(productCategoryTerms))

// 🔹 Filter attributen (kleur, maat, etc.)
const attributesWithTerms = globalProductAttributes.map((attr) => ({
  ...attr,
  terms: terms?.filter((term) => term.taxonomyName === attr.slug),
}))
</script>

<template>
  <aside id="filters">
    <OrderByDropdown class="block w-full md:hidden" />
    <div class="relative z-30 grid mb-12 space-y-8 divide-y">


      <!-- 📂 Categorieboom -->
      <div v-if="!hideCategories && categoryTree?.length" class="pt-4">
        <h3 class="font-semibold text-gray-900 mb-3">Categorieën</h3>
        <ul class="space-y-2">
          <li v-for="cat in categoryTree" :key="cat.id">
            <NuxtLink
              :to="`/${cat.slug}`"
              class="block font-medium hover:text-primary-600"
              :class="{ 'underline text-primary-600': cat.slug === currentSlug }"
            >
              {{ cat.name }}
            </NuxtLink>

            <!-- Subcategorieën -->
            <ul v-if="cat.children?.length && cat.slug === currentSlug" class="ml-4 mt-2 space-y-1">
              <li v-for="child in cat.children" :key="child.id">
                <NuxtLink
                  :to="`/${child.slug}`"
                  class="block text-gray-700 hover:text-primary-600"
                  :class="{ 'underline text-primary-600': child.slug === currentSlug }"
                >
                  {{ child.name }}
                </NuxtLink>

                <!-- Sub-subcategorieën -->
                <ul
                  v-if="child.children?.length && child.slug === currentSlug"
                  class="ml-4 mt-1 space-y-1"
                >
                  <li v-for="sub in child.children" :key="sub.id">
                    <NuxtLink
                      :to="`/${sub.slug}`"
                      class="block text-gray-600 hover:text-primary-600"
                      :class="{ 'underline text-primary-600': sub.slug === currentSlug }"
                    >
                      {{ sub.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
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

ul ul {
  @apply ml-4;
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

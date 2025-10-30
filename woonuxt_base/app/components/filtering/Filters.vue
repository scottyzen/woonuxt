<script setup lang="ts">
import { ref, computed } from 'vue'
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

// ✅ Ancestors in juiste volgorde (root → parent → current)
const orderedAncestors = computed(() => {
  const list = category.value?.ancestors?.nodes || []
  return [...list].reverse()
})

// 🧭 Rootcategorie
const rootCategory = computed(() =>
  orderedAncestors.value.length ? orderedAncestors.value[0] : category.value
)

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

// 🎬 Accordion state
const openCategories = ref(true)
</script>

<template>
  <aside id="filters">
    <OrderByDropdown class="block w-full md:hidden" />

    <div class="relative z-30 grid mb-12 space-y-8 divide-y">
      <!-- 📂 Categorieboom -->
      <div v-if="!hideCategories && category" class="pt-4">
        <div
          class="flex justify-between items-center cursor-pointer"
          @click="openCategories = !openCategories"
        >
          <h3 class="font-semibold text-gray-900">
            Categorieën<span v-if="rootCategory"> — {{ rootCategory.name }}</span>
          </h3>
          <Icon
            name="lucide:chevron-down"
            class="w-4 h-4 transition-transform"
            :class="{ 'rotate-180': openCategories }"
          />
        </div>

        <Transition name="slide-fade">
          <div v-show="openCategories">
            <!-- 🔙 Terug naar parent -->
            <div v-if="parentCategory" class="mb-3 mt-2">
              <NuxtLink
                :to="`/${parentCategory.slug}`"
                class="text-sm text-gray-500 hover:text-primary transition"
              >
                ← Terug naar {{ parentCategory.name }}
              </NuxtLink>
            </div>

            <!-- 🌿 Boomstructuur -->
            <ul class="space-y-1">
              <!-- Ancestors -->
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

                <!-- Subcategorieën -->
                <ul
                  v-if="subCategories?.length"
                  class="space-y-1 mt-1 border-l border-gray-200 pl-3"
                >
                  <li v-for="sub in subCategories" :key="sub.id">
                    <NuxtLink
                      :to="`/${sub.slug}`"
                      class="block text-gray-700 hover:text-primary transition"
                      :class="{
                        'underline text-primary font-medium': sub.slug === currentSlug,
                      }"
                    >
                      {{ sub.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </Transition>
      </div>

      <!-- 💰 Prijsfilter -->
      <PriceFilter v-if="storeSettings.showFilters" />

      <!-- 🎨 Attributenfilters -->
      <div v-if="storeSettings.showFilters" v-for="attribute in attributesWithTerms" :key="attribute.slug">
        <ColorFilter
          v-if="attribute.slug == 'pa_color' || attribute.slug == 'pa_colour'"
          :attribute
        />
        <GlobalFilter v-else :attribute />
      </div>

      <OnSaleFilter v-if="storeSettings.showFilters" />
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

a {
  @apply text-base text-gray-700;
}

a.underline {
  text-decoration-thickness: 1.5px;
  text-underline-offset: 2px;
}

a:hover {
  @apply text-primary;
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

/* Animatie voor accordion */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-5px);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  max-height: 1000px;
  transform: translateY(0);
}
</style>

<template>
  <aside id="filters" :class="{ active: showFilters }">
    <div class="top-8 sticky">
      <!-- Price Range -->
      <div class="mt-3 mb-3">Price Range</div>
      <div class="flex gap-4 justify-between">
        <div class="flex w-1/2 relative items-center">
          <span v-if="filter.minPrice" class="p-2 absolute">€</span>
          <input class="price-input" type="number" placeholder="Min" min="0" v-model.number="filter.minPrice" step="1" :class="{ active: filter.minPrice }" />
        </div>
        <div class="flex w-1/2 relative items-center">
          <span v-if="filter.maxPrice" class="p-2 absolute">€</span>
          <input class="price-input" type="number" placeholder="Max" min="0" max="" v-model.number="filter.maxPrice" step="1" :class="{ active: filter.maxPrice }" />
        </div>
      </div>

      <div class="mt-8 mb-3">Categories</div>
      <CategoryFilter @checkbox-changed="updatedCategoryFilter" :active-categories="activeCategories" />

      <ColorFilter @color-changed="updatedColorFilter" :active-colors="activeColors" />

      <div class="mt-8 mb-3">Rating</div>
      <div>
        <label class="flex items-center">
          <input id="star-five" type="radio" :value="5" v-model="filter.starRating" />
          <Stars :number="5" />
        </label>
        <label class="flex items-center">
          <input id="star-four" type="radio" :value="4" v-model="filter.starRating" />
          <Stars :number="4" />
        </label>
        <label class="flex items-center">
          <input id="star-three" type="radio" :value="3" v-model="filter.starRating" />
          <Stars :number="3" />
        </label>
        <label class="flex items-center">
          <input id="star-two" type="radio" :value="2" v-model="filter.starRating" />
          <Stars :number="2" />
        </label>
        <label class="flex items-center">
          <input id="star-one" type="radio" :value="1" v-model="filter.starRating" />
          <Stars :number="1" />
        </label>
      </div>

      <!-- Products On Sale -->
      <div class="mt-8 mb-3 grid gap-1">
        <label for="on-sale" class="flex items-center">
          <input id="on-sale" type="checkbox" v-model="filter.saleItemsOnly" />
          <span class="ml-2">Products On Sale</span>
        </label>
      </div>

      <transition name="fadeUp">
        <button
          v-if="showRestButton"
          @click="reset"
          class="bg-primary-light rounded-xl cursor-pointer my-8 text-center text-white leading-tight w-full p-2 block hover:bg-purple-700"
        >
          Clear all filters
        </button>
      </transition>
    </div>
  </aside>
</template>

<script>
export default {
  data() {
    const initialState = {
      minPrice: null,
      maxPrice: null,
      starRating: null,
      saleItemsOnly: false,
      categories: [],
      colors: [],
    };
    return {
      filter: initialState,
      initialState: JSON.stringify(initialState),
    };
  },
  props: {
    showFilters: { type: Boolean, default: false },
    params: { type: Object, default: () => ({}) },
  },
  mounted() {
    if (this.$store.state.filter) {
      this.filter = this.$store.state.filter;
    }
  },
  methods: {
    reset() {
      this.filter = JSON.parse(this.initialState);
    },
    updatedCategoryFilter(categories) {
      this.filter.categories = categories;
    },
    updatedColorFilter(colors) {
      this.filter.colors = colors;
    },
  },
  watch: {
    filter: {
      handler(newVal, oldVal) {
        // check if newVal is equal to initialState
        if (JSON.stringify(newVal) === this.initialState) {
          this.$store.commit("setFilter", null);
        } else {
          this.$store.commit("setFilter", newVal);
        }
        this.$emit("filter-updated");
      },
      deep: true,
    },
  },
  computed: {
    showRestButton() {
      return JSON.stringify(this.filter) !== this.initialState;
    },
    activeCategories() {
      return [...this.filter.categories, this.params.categorySlug];
    },
    activeColors() {
      return [...this.filter.colors];
    },
  },
};
</script>

<style lang="postcss" scoped>
#filters {
  @apply bg-white my-8 pr-8 top-8 w-[225px] sticky;
  box-shadow: -100px 0 0 white, -200px 0 0 white, -300px 0 0 white;
}

.price-input {
  @apply border rounded-xl outline-none leading-tight w-full p-2 transition-all;
}

.price-input.active {
  @apply border-gray-400 pl-6;
}

.fadeUp-enter-active,
.fadeUp-leave-active {
  transition: all 300ms;
}

.fadeUp-enter,
.fadeUp-leave-active {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  #filters {
    @apply h-full transform transition-all top-16 ease-in-out bottom-0 left-8 z-20 -translate-x-[110vw] duration-500 fixed;
  }

  #filters.active {
    @apply transform-none;
  }
}
</style>

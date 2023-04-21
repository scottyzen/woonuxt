<script setup>
const { removeBodyClass } = useHelpers();
const runtimeConfig = useRuntimeConfig();
const globalProductAttributes = runtimeConfig?.public?.GLOBAL_PRODUCT_ATTRIBUTES || [];
</script>

<template>
  <aside id="filters">
    <OrderByDropdown class="w-full block md:hidden" />
    <div class="divide-y space-y-8 mb-12 grid z-30 relative">
      <PriceFilter />
      <CategoryFilter />
      <div v-for="attribute in globalProductAttributes" :key="attribute.slug">
        <ColorFilter
          v-if="attribute.slug == 'pa_color' || attribute.slug == 'pa_colour'"
          :filter-slug="attribute.slug"
          :label="attribute.label"
          :open="attribute.openByDefault"
          :show-count="attribute.showCount"
          :hide-empty="attribute.hideEmpty" />
        <GlobalFilter
          v-else
          :filter-slug="attribute.slug"
          :label="attribute.label"
          :open="attribute.openByDefault"
          :show-count="attribute.showCount"
          :hide-empty="attribute.hideEmpty" />
      </div>
      <!-- <OnSaleFilter /> -->
      <StarRatingFilter />
      <ResetFiltersButton />
    </div>
  </aside>
  <div class="bg-black opacity-25 inset-0 z-50 fixed filter-overlay" @click="removeBodyClass('show-filters')"></div>
</template>

<style lang="postcss">
#filters {
  @apply w-[280px];
}

.filter-overlay {
  @apply hidden;
}

.show-filters .filter-overlay {
  @apply block;
}
.show-filters {
  overflow: hidden;
}

#filters input[type='checkbox'],
#filters input[type='radio'] {
  @apply bg-white border rounded-lg cursor-pointer font-sans outline-none border-gray-300 w-full p-3 transition-all duration-200 appearance-none hover:border-primary;
  width: 1em;
  height: 1em;
  position: relative;
  cursor: pointer;
  border-radius: 4px;
  padding: 0;
}

#filters input[type='radio'] {
  border-radius: 50%;
}

#filters input[type='checkbox']:after {
  content: '';
  display: block;
  width: 5px;
  height: 9px;
  border: 2px solid #fff;
  border-top: 0;
  border-left: 0;
  transform: rotate(0deg) translate(-1px, 1px) scale(0.75);
  transition: all 300ms cubic-bezier(0.65, -0.43, 0.4, 1.71);
  opacity: 0;
  position: absolute;
  top: 3px;
  left: 6.5px;
}

#filters input[type='radio']:after {
  content: '';
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transform: scale(0);
  transition: all 300ms cubic-bezier(0.65, -0.43, 0.4, 1.71);
  opacity: 0;
  position: absolute;
  background: #fff;
  top: 4px;
  left: 4px;
}

#filters input[type='checkbox'] + label,
#filters input[type='radio'] + label {
  @apply cursor-pointer text-gray-500 hover:text-gray-800;
}

#filters input[type='checkbox']:checked + label,
#filters input[type='radio']:checked + label {
  @apply text-gray-800;
}

#filters input[type='checkbox']:checked,
#filters input[type='radio']:checked {
  @apply bg-primary border-0;
}

#filters input[type='checkbox']:checked:after {
  opacity: 1;
  transform: rotate(45deg) translate(-1px, 1px) scale(1);
}

#filters input[type='radio']:checked:after {
  opacity: 1;
  transform: scale(1);
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
    @apply bg-white h-full p-8 transform pl-2 transition-all ease-in-out bottom-0 left-4 -translate-x-[110vw] duration-500 overflow-auto fixed;
    box-shadow: -100px 0 0 white, -200px 0 0 white, -300px 0 0 white;
    z-index: 60;
  }

  .show-filters #filters {
    @apply transform-none;
  }
}
</style>

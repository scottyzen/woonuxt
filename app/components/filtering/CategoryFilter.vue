<script setup>
const { getFilter, setFilter, isFiltersActive } = useFiltering();
const props = defineProps({ terms: { type: Array, required: true }, label: { type: String, default: '' }, openByDefault: { type: Boolean, default: true }, showCount: { type: Boolean, default: false } });
const isOpen = ref(props.openByDefault);
const selectedTerms = ref(getFilter('category') || []);
const route = useRoute();
const routeSlug = route.params.slug ?? route.params.categorySlug;
const categorySlug = Array.isArray(routeSlug) ? routeSlug[0] : routeSlug;
if (categorySlug) selectedTerms.value = [categorySlug];
watch(isFiltersActive, () => { if (!isFiltersActive.value) selectedTerms.value = []; });
const checkboxChanged = () => setFilter('category', selectedTerms.value);
</script>

<template>
  <div v-if="terms.length">
    <button type="button" class="flex w-full cursor-pointer items-center justify-between pt-1 text-left font-extrabold text-[#173f2b]" @click="isOpen = !isOpen">
      <span>{{ label || $t('shop.category', 2) }}</span><Icon name="ion:chevron-up-outline" class="text-[#0d5134]" :class="isOpen ? '' : 'rotate-180'" />
    </button>
    <div v-show="isOpen" class="mt-4 grid max-h-60 gap-2.5 overflow-auto pr-1 custom-scrollbar">
      <label v-for="term in terms" :key="term.slug" :for="term.slug" class="flex cursor-pointer items-center gap-2.5 text-sm leading-tight text-[#4d6256]">
        <input :id="term.slug" v-model="selectedTerms" type="checkbox" :value="term.slug" @change="checkboxChanged" />
        <span v-html="term.name"></span><small v-if="showCount" class="text-[#8fa092]">({{ term.count || 0 }})</small>
      </label>
    </div>
  </div>
</template>

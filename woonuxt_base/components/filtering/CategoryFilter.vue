<script setup>
const props = defineProps({
  label: { type: String, default: '' },
  hideEmpty: { type: Boolean, default: false },
  showCount: { type: Boolean, default: false },
  open: { type: Boolean, default: true },
});

const { data } = await useAsyncGql('getProductCategories');

const allCategories = data.value?.productCategories?.nodes || [];
const { getFilter, setFilter, isFiltersActive } = useFiltering();
const selectedTerms = ref(getFilter('category') || []);

const route = useRoute();
const categorySlug = route.params.categorySlug;
if (categorySlug) selectedTerms.value = [categorySlug];

const isOpen = ref(props.open);

watch(isFiltersActive, () => {
  // uncheck all checkboxes when filters are cleared
  if (!isFiltersActive.value) selectedTerms.value = [];
});

// Update the URL when the checkbox is changed
const checkboxChanged = () => {
  setFilter('category', selectedTerms.value);
};
</script>

<template>
  <div v-if="allCategories.length">
    <div class="cursor-pointer flex font-semibold mt-8 justify-between items-center" @click="isOpen = !isOpen">
      <span>{{ label || $t('messages.shop.category', 2) }}</span>
      <Icon name="ion:chevron-down-outline" class="transform" :class="isOpen ? 'rotate-180' : ''" />
    </div>
    <div v-show="isOpen" class="mt-3 mr-1 max-h-[240px] grid gap-1.5 overflow-auto custom-scrollbar">
      <div v-for="color in allCategories" :key="color.slug" class="flex gap-2 items-start">
        <input :id="color.slug" v-model="selectedTerms" type="checkbox" :value="color.slug" @change="checkboxChanged" />
        <label :for="color.slug" class="cursor-pointer m-0 text-sm flex-1 leading-tight">
          <span v-html="color.name" />
          <span v-if="showCount" class="ml-1 text-gray-400 tabular-nums">({{ color.count || 0 }})</span>
        </label>
      </div>
    </div>
  </div>
</template>

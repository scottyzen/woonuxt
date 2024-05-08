<script setup lang="ts">
const { getFilter, setFilter, isFiltersActive } = useFiltering();

const props = defineProps({
  productAttribute: { type: Object as PropType<GlobalProductAttribute>, required: true },
});

const taxonomies = props.productAttribute.slug.toUpperCase().replace('_', '');
const { data } = await useAsyncGql('getAllTerms', { taxonomies, hideEmpty: props.productAttribute.hideEmpty });
const allPaTerms = computed(() => data.value?.terms?.nodes || []);

const selectedTerms = ref<string[]>(getFilter(props.productAttribute.slug) || []);
const filterTitle = ref<string>(props.productAttribute?.label || props.productAttribute?.slug);
const isOpen = ref<boolean>(props.productAttribute.openByDefault || false);
const showCount = ref<boolean>(props.productAttribute.showCount || false);

watch(isFiltersActive, () => {
  // uncheck all checkboxes when filters are cleared
  if (!isFiltersActive.value) selectedTerms.value = [];
});

// Update the URL when the checkbox is changed
const checkboxChanged = () => {
  setFilter(props.productAttribute.slug, selectedTerms.value);
};
</script>

<template>
  <div v-if="allPaTerms.length" class="cursor-pointer flex font-semibold mt-8 leading-none justify-between items-center" @click="isOpen = !isOpen">
    <span>{{ filterTitle }}</span>
    <Icon name="ion:chevron-down-outline" class="transform" :class="isOpen ? 'rotate-180' : ''" />
  </div>
  <div v-show="isOpen" class="mt-3 mr-1 max-h-[240px] grid gap-1 overflow-auto custom-scrollbar">
    <div v-for="({ count, slug, name }, index) in allPaTerms" :key="slug || index" class="flex gap-2 items-center">
      <input :id="slug" v-model="selectedTerms" type="checkbox" :value="slug" @change="checkboxChanged" />
      <label :for="slug" class="cursor-pointer m-0 text-sm flex items-center flex-wrap">
        <span v-html="name" />
        <small v-if="showCount" class="ml-1 text-gray-400 tabular-nums" aria-hidden="true">({{ count || 0 }})</small>
      </label>
    </div>
  </div>
</template>
